import{d as b,u as v,m as x,n as _,o as V,l as y,e as o,w as s,b as k,r,g as C,j as L,_ as U}from"./main-fc31b61e.js";const B={class:"login-container"},N=b({__name:"Login",setup(R){const p=k(),u=v(),n=x(),t=_({username:"",password:""}),c=_({username:[{required:!0,message:"请输入用户名",trigger:"blur"}],password:[{required:!0,message:"请输入密码",trigger:"blur"}]}),i=async()=>{n.value&&await n.value.validate(d=>{d&&(u.setUserInfo({username:t.username,roles:["user"]}),u.setToken("dummy-token"),p.push("/xuexi/demo1/test/home"))})};return(d,e)=>{const m=r("el-input"),a=r("el-form-item"),f=r("el-button"),g=r("el-form"),w=r("el-card");return V(),y("div",B,[o(w,{class:"login-card"},{header:s(()=>e[2]||(e[2]=[C("h2",null,"登录系统",-1)])),default:s(()=>[o(g,{ref_key:"formRef",ref:n,model:t,rules:c,"label-width":"80px"},{default:s(()=>[o(a,{label:"用户名",prop:"username"},{default:s(()=>[o(m,{modelValue:t.username,"onUpdate:modelValue":e[0]||(e[0]=l=>t.username=l)},null,8,["modelValue"])]),_:1}),o(a,{label:"密码",prop:"password"},{default:s(()=>[o(m,{modelValue:t.password,"onUpdate:modelValue":e[1]||(e[1]=l=>t.password=l),type:"password","show-password":""},null,8,["modelValue"])]),_:1}),o(a,null,{default:s(()=>[o(f,{type:"primary",onClick:i},{default:s(()=>e[3]||(e[3]=[L("登录")])),_:1})]),_:1})]),_:1},8,["model","rules"])]),_:1})])}}});const q=U(N,[["__scopeId","data-v-c6cf2abc"]]);export{q as default};
//# sourceMappingURL=Login-5548b958.js.map
