
const express = require('express')
require('dotenv').config()
const ST24 = require('./st24')
const app = express()
const xmlparser = require('express-xml-bodyparser')
const xmlOptions = {
  charkey: 'value',
  trim: false,
  explicitRoot: false,
  explicitArray: false,
  normalizeTags: false,
  mergeAttrs: true,
};
let st24 = new ST24({baseurl: process.env.baseurl,username:process.env.username,pin: process.env.pin})

app.use(express.json())
app.use(express.urlencoded({ extended: false }));
app.use(express.text())

const bustHeaders = (request, response, next) => {
  request.app.isXml = false;
  if (request.headers['content-type'] === 'application/xml'
    || request.headers['accept'] === 'application/xml'
  ) {
    request.app.isXml = true;
  }

  next();
};

app.get('/trx', async (req, res) => {

    const resp = await st24.sendTopupTequest(req.query.tujuan,req.query.kode,req.query.idtrx);
    res.json(resp)
});


app.post('/xmlrpc/callback',bustHeaders,xmlparser({explicitArray:false}),(req,res)=>{

    const bodyreq = req.body;
    console.log('[CALLBACK]')

    console.log(JSON.stringify(bodyreq.methodcall.params.param.value.struct.member))

    res.json({success:true,msg:'ok'})
})

app.listen(8080, () => {
    console.log(`Server started on port`);
});

