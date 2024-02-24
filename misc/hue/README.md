# HUE INTERFACE

## credentials and configuration
seee https://developers.meethue.com/develop/get-started-2/
v2 (not working) https://developers.meethue.com/develop/hue-api-v2/getting-started/

get bridge ip: https://discovery.meethue.com

http://192.168.1.116/debug/clip.html
/api
{"devicetype": "odense_hue", "generateclientkey": true}
POST



save to ~/.hue.bridge
{
   "bridge": "192.168.1.116",
   "id": "??????"
   "username": "???????",
   "clientkey", "?????????
   "devicetype": "odense_hue"
}


curl --cacert mybridge_cert.pem --resolve "ecb5fafffe0b1cec:443:192.168.1.116" https://ecb5fafffe0b1cec/api/4F8mgh-oPlsAbjYpBV6jgRwHT55qxIQUQhAao5r9/lights