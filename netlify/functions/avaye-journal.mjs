import {getDatabase,getConnectionString} from '@netlify/database';
import {getUser,login,logout} from '@netlify/identity';
import {createHandler} from '../../avaye/handler.mjs';
import {Problem} from '../../avaye/model.mjs';

let cached;
function pool(){
  const url=getConnectionString();
  if(cached?.url!==url){
    const previous=cached?.pool;
    cached={url,pool:getDatabase({connectionString:url}).pool};
    if(previous)void previous.end().catch(()=>{});
  }
  return cached.pool;
}

export default createHandler({
  get db(){return pool();},
  async transaction(fn){
    const client=await pool().connect();
    try {await client.query('BEGIN');const result=await fn(client);await client.query('COMMIT');return result;}
    catch(err){await client.query('ROLLBACK');throw err;}
    finally{client.release();}
  },
  user:()=>getUser(),
  async login(email,password){try{await login(email,password);}catch(e){
    if(e.status===400||e.status===401)throw new Problem(401,'ورود انجام نشد. ایمیل و گذرواژه را بررسی کنید.');
    if(e.status===403||e.name==='AuthError')throw new Problem(503,'سرویس ورود در دسترس نیست یا تنظیمات اتصال آن نیاز به بررسی دارد.');
    throw e;
  }},
  logout:()=>logout()
});
export const config={path:['/journal','/journal/*']};
