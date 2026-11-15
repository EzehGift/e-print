"use strict";(()=>{var e={};e.id=2581,e.ids=[2581],e.modules={53524:e=>{e.exports=require("@prisma/client")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},71872:(e,t,r)=>{r.r(t),r.d(t,{headerHooks:()=>A,originalPathname:()=>v,patchFetch:()=>R,requestAsyncStorage:()=>x,routeModule:()=>y,serverHooks:()=>I,staticGenerationAsyncStorage:()=>b,staticGenerationBailout:()=>O});var a={};r.r(a),r.d(a,{GET:()=>w,dynamic:()=>$});var i=r(95419),o=r(69108),n=r(99678),s=r(3214);let d="https://eprints.gouni.edu.ng",c=`${d}/api/oai`;function u(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&apos;")}function p(e,t={}){let r=Object.entries(t).map(([e,t])=>` ${e}="${u(t)}"`).join("");return`<?xml version="1.0" encoding="UTF-8"?>
<OAI-PMH xmlns="http://www.openarchives.org/OAI/2.0/"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://www.openarchives.org/OAI/2.0/
           http://www.openarchives.org/OAI/2.0/OAI-PMH.xsd">
  <responseDate>${new Date().toISOString()}</responseDate>
  <request verb="${e}"${r}>${c}</request>`}let l=`
</OAI-PMH>`;function m(e,t,r){return`${p(r??"")}
  <error code="${e}">${u(t)}</error>${l}`}let h={THESIS:"Text",ARTICLE:"Text",BOOK:"Text",BOOK_CHAPTER:"Text",CONFERENCE_PAPER:"Text",REPORT:"Text",OTHER:"Text"};function f(e){let t=`oai:eprints.gouni.edu.ng:${e.id}`,r=e.updatedAt.toISOString(),a=[...e.authors].sort((e,t)=>e.order-t.order).map(e=>`      <dc:creator>${u(`${e.author.lastName}, ${e.author.firstName}`)}</dc:creator>`).join("\n"),i=[...e.subjects.map(e=>`      <dc:subject>${u(e.subject.name)}</dc:subject>`),...e.keywords.map(e=>`      <dc:subject>${u(e.keyword.value)}</dc:subject>`)].join("\n"),o=[`      <dc:identifier>${u(`${d}/items/${e.id}`)}</dc:identifier>`,e.doi?`      <dc:identifier>${u(e.doi)}</dc:identifier>`:null].filter(Boolean).join("\n"),n=e.files.map(e=>`      <dc:format>${u(e.mimeType)}</dc:format>`).join("\n");return`    <record>
      <header>
        <identifier>${t}</identifier>
        <datestamp>${r}</datestamp>
      </header>
      <metadata>
        <oai_dc:dc xmlns:oai_dc="http://www.openarchives.org/OAI/2.0/oai_dc/"
                   xmlns:dc="http://purl.org/dc/elements/1.1/"
                   xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                   xsi:schemaLocation="http://www.openarchives.org/OAI/2.0/oai_dc/
                     http://www.openarchives.org/OAI/2.0/oai_dc.xsd">
          <dc:title>${u(e.title)}</dc:title>
${a}
${i}
          <dc:description>${u(e.abstract)}</dc:description>
          <dc:date>${e.year}</dc:date>
          <dc:type>${h[e.type]}</dc:type>
          <dc:language>${u(e.language)}</dc:language>
${o}
${n}
          <dc:publisher>${u("Godfrey Okoye University")}</dc:publisher>
        </oai_dc:dc>
      </metadata>
    </record>`}async function g(e,t){if(!e)return m("badVerb","Missing verb parameter");if("Identify"===e){let e=await s._.item.findFirst({where:{status:"PUBLISHED"},orderBy:{createdAt:"asc"},select:{createdAt:!0}});return`${p("Identify")}
  <Identify>
    <repositoryName>GOREPO</repositoryName>
    <baseURL>${c}</baseURL>
    <protocolVersion>2.0</protocolVersion>
    <adminEmail>eprints@gouni.edu.ng</adminEmail>
    <earliestDatestamp>${e?.createdAt.toISOString()??"2018-01-01T00:00:00Z"}</earliestDatestamp>
    <deletedRecord>no</deletedRecord>
    <granularity>YYYY-MM-DDThh:mm:ssZ</granularity>
  </Identify>${l}`}if("ListMetadataFormats"===e)return`${p("ListMetadataFormats")}
  <ListMetadataFormats>
    <metadataFormat>
      <metadataPrefix>oai_dc</metadataPrefix>
      <schema>http://www.openarchives.org/OAI/2.0/oai_dc.xsd</schema>
      <metadataNamespace>http://www.openarchives.org/OAI/2.0/oai_dc/</metadataNamespace>
    </metadataFormat>
  </ListMetadataFormats>${l}`;if("ListSets"===e)return m("noSetHierarchy","This repository does not support sets",e);if("ListRecords"===e||"ListIdentifiers"===e){let{metadataPrefix:r,from:a,until:i}=t;if(!r)return m("badArgument","metadataPrefix is required",e);if("oai_dc"!==r)return m("cannotDisseminateFormat",`Format ${r} is not supported`,e);let o={status:"PUBLISHED"};(a||i)&&(o.updatedAt={...a?{gte:new Date(a)}:{},...i?{lte:new Date(i)}:{}});let n=await s._.item.findMany({where:o,include:{authors:{include:{author:!0},orderBy:{order:"asc"}},subjects:{include:{subject:!0}},keywords:{include:{keyword:!0}},files:!0},orderBy:{updatedAt:"desc"},take:100});if(0===n.length)return m("noRecordsMatch","No records match the given criteria",e);if("ListIdentifiers"===e){let e=n.map(e=>`    <header>
      <identifier>oai:eprints.gouni.edu.ng:${e.id}</identifier>
      <datestamp>${e.updatedAt.toISOString()}</datestamp>
    </header>`).join("\n");return`${p("ListIdentifiers",{metadataPrefix:r})}
  <ListIdentifiers>
${e}
  </ListIdentifiers>${l}`}let d=n.map(e=>f(e)).join("\n");return`${p("ListRecords",{metadataPrefix:r})}
  <ListRecords>
${d}
  </ListRecords>${l}`}if("GetRecord"===e){let{identifier:r,metadataPrefix:a}=t;if(!r)return m("badArgument","identifier is required",e);if(!a)return m("badArgument","metadataPrefix is required",e);if("oai_dc"!==a)return m("cannotDisseminateFormat",`Format ${a} is not supported`,e);let i=r.replace("oai:eprints.gouni.edu.ng:",""),o=await s._.item.findUnique({where:{id:i},include:{authors:{include:{author:!0},orderBy:{order:"asc"}},subjects:{include:{subject:!0}},keywords:{include:{keyword:!0}},files:!0}});return o&&"PUBLISHED"===o.status?`${p("GetRecord",{identifier:r,metadataPrefix:a})}
  <GetRecord>
${f(o)}
  </GetRecord>${l}`:m("idDoesNotExist",`No record with identifier ${r}`,e)}return m("badVerb",`Illegal OAI verb: ${e}`)}let $="force-dynamic";async function w(e){let{searchParams:t}=new URL(e.url),r=t.get("verb")??"",a={};t.forEach((e,t)=>{"verb"!==t&&(a[t]=e)});let i=await g(r,a);return new Response(i,{status:200,headers:{"Content-Type":"text/xml; charset=utf-8"}})}let y=new i.AppRouteRouteModule({definition:{kind:o.x.APP_ROUTE,page:"/api/oai/route",pathname:"/api/oai",filename:"route",bundlePath:"app/api/oai/route"},resolvedPagePath:"C:\\Users\\-\\Desktop\\projects\\e-prints\\app\\api\\oai\\route.ts",nextConfigOutput:"",userland:a}),{requestAsyncStorage:x,staticGenerationAsyncStorage:b,serverHooks:I,headerHooks:A,staticGenerationBailout:O}=y,v="/api/oai/route";function R(){return(0,n.patchFetch)({serverHooks:I,staticGenerationAsyncStorage:b})}},3214:(e,t,r)=>{r.d(t,{_:()=>i});var a=r(53524);let i=global.prisma??new a.PrismaClient({log:["error"]})},95419:(e,t,r)=>{e.exports=r(30517)}};var t=require("../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),a=t.X(0,[1638],()=>r(71872));module.exports=a})();