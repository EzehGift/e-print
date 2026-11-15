"use strict";(()=>{var e={};e.id=4946,e.ids=[4946],e.modules={53524:e=>{e.exports=require("@prisma/client")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},3869:(e,t,r)=>{r.r(t),r.d(t,{headerHooks:()=>g,originalPathname:()=>$,patchFetch:()=>f,requestAsyncStorage:()=>p,routeModule:()=>l,serverHooks:()=>m,staticGenerationAsyncStorage:()=>c,staticGenerationBailout:()=>h});var a={};r.r(a),r.d(a,{GET:()=>d,dynamic:()=>u});var i=r(95419),n=r(69108),o=r(99678),s=r(12305);let u="force-dynamic";async function d(){let e=await (0,s.e)();return new Response(e,{headers:{"Content-Type":"application/rss+xml; charset=utf-8"}})}let l=new i.AppRouteRouteModule({definition:{kind:n.x.APP_ROUTE,page:"/api/feed/rss/route",pathname:"/api/feed/rss",filename:"route",bundlePath:"app/api/feed/rss/route"},resolvedPagePath:"C:\\Users\\-\\Desktop\\projects\\e-prints\\app\\api\\feed\\rss\\route.ts",nextConfigOutput:"",userland:a}),{requestAsyncStorage:p,staticGenerationAsyncStorage:c,serverHooks:m,headerHooks:g,staticGenerationBailout:h}=l,$="/api/feed/rss/route";function f(){return(0,o.patchFetch)({serverHooks:m,staticGenerationAsyncStorage:c})}},12305:(e,t,r)=>{r.d(t,{U:()=>u,e:()=>d});var a=r(3214);let i="https://eprints.gouni.edu.ng",n="GOREPO";function o(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}async function s(){return a._.item.findMany({where:{status:"PUBLISHED"},include:{authors:{include:{author:!0},orderBy:{order:"asc"}},division:!0},orderBy:{createdAt:"desc"},take:20})}async function u(){let e=await s(),t=e[0]?.updatedAt??new Date,r=e.map(e=>{let t=[...e.authors].sort((e,t)=>e.order-t.order).map(e=>`<author><name>${o(`${e.author.firstName} ${e.author.lastName}`)}</name></author>`).join("\n    ");return`  <entry>
    <id>${i}/items/${e.id}</id>
    <title>${o(e.title)}</title>
    <link rel="alternate" href="${i}/items/${e.id}"/>
    ${t}
    <updated>${e.updatedAt.toISOString()}</updated>
    <published>${e.createdAt.toISOString()}</published>
    <summary>${o(e.abstract.slice(0,300))}...</summary>
    <category term="${e.type}"/>
  </entry>`}).join("\n");return`<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${n}</title>
  <subtitle>Latest research from Godfrey Okoye University</subtitle>
  <link rel="alternate" href="${i}"/>
  <link rel="self" href="${i}/api/feed/atom"/>
  <id>${i}/api/feed/atom</id>
  <updated>${t.toISOString()}</updated>
  <author><name>GOREPO</name><email>eprints@gouni.edu.ng</email></author>
${r}
</feed>`}async function d(){let e=(await s()).map(e=>{let t=[...e.authors].sort((e,t)=>e.order-t.order).map(e=>`${e.author.firstName} ${e.author.lastName}`).join(", ");return`    <item>
      <title>${o(e.title)}</title>
      <link>${i}/items/${e.id}</link>
      <guid isPermaLink="true">${i}/items/${e.id}</guid>
      <description>${o(e.abstract.slice(0,300))}...</description>
      <author>${o(t)}</author>
      <pubDate>${e.createdAt.toUTCString()}</pubDate>
      <category>${e.type}</category>
    </item>`}).join("\n");return`<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${n}</title>
    <link>${i}</link>
    <description>Latest research outputs from Godfrey Okoye University, Enugu, Nigeria</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <managingEditor>eprints@gouni.edu.ng (GOREPO)</managingEditor>
${e}
  </channel>
</rss>`}},3214:(e,t,r)=>{r.d(t,{_:()=>i});var a=r(53524);let i=global.prisma??new a.PrismaClient({log:["error"]})},95419:(e,t,r)=>{e.exports=r(30517)}};var t=require("../../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),a=t.X(0,[1638],()=>r(3869));module.exports=a})();