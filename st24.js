const axios = require('axios')
const convert = require('xml-js')
const xmlBuilder = require('xmlbuilder')

class ST24 {
  constructor(options = {}) {
    this.username= options.username;
    this.pin = options.pin;
    this.agent = 'IRSX-JS'
    const headers = {
      'User-Agent': this.agent,
      'Content-Type': 'text/xml',
    }
    this.instance = axios.create({
      baseURL: options.baseurl,
      withCredentials: true,
      headers,
    })
  }

  getXMLTopupRequest(tujuan, denom,idtrx) {
    let dataxml = {
      methodCall: {
              methodName: 'topUpRequest',
      params: {
        param: {
          value: {
            struct: {
              member: [
                { name: 'MSISDN', value: {
                    string: this.username
                } },
                { name: 'REQUESTID', value: {
                    string:idtrx
                } },
                { name: 'PIN', value: {
                    string:this.pin
                } },
                { name: 'NOHP', value: {
                    string:tujuan
                } },
                { name: 'NOM', value: {
                    string :denom
                } },
              ],
            },
          },
        },
      },
      }
    }

    return xmlBuilder.create(dataxml).end({ pretty: true })
  }
  async sendTopupTequest(tujuan,denom,idtrx){

    let xml = this.getXMLTopupRequest(tujuan, denom, idtrx)
    var resp
    try {
       let res = await this.instance.post('/',xml)
        let json =JSON.parse(convert.xml2json(res.data,{ compact: true, spaces: 2 }))
        resp = {
          tujuan: tujuan,
          denom: denom,
          rc:json.methodResponse.params.param.value.struct.member[0].value.string['_text'],
          reqid:json.methodResponse.params.param.value.struct.member[1].value.string['_text'],
          message:json.methodResponse.params.param.value.struct.member[2].value.string['_text'],
          sn:json.methodResponse.params.param.value.struct.member[3].value.string['_text'],
          transactionid:json.methodResponse.params.param.value.struct.member[4].value.string['_text'],
          data:json.methodResponse.params.param.value.struct.member[5].value.string['_text']
        }
    } catch (error) {
        console.log(error.response.data)
        let json =JSON.parse(convert.xml2json(error.response.data,{ compact: true, spaces: 2 }))
        resp = {
          tujuan: tujuan,
          denom: denom,
          rc:json.methodResponse.params.param.value.struct.member[0].value.string['_text'],
          reqid:json.methodResponse.params.param.value.struct.member[1].value.string['_text'],
          message:json.methodResponse.params.param.value.struct.member[2].value.string['_text'],
          sn:json.methodResponse.params.param.value.struct.member[3].value.string['_text'],
          transactionid:json.methodResponse.params.param.value.struct.member[4].value.string['_text'],
          data:json.methodResponse.params.param.value.struct.member[5].value.string['_text']
        }
    }

    
    
    return resp;
  }
}

module.exports = ST24
