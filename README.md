# Webmail-System
Use following steps to run the web mail system:

First, fill in your own email info(user and pass) in to the file "server/serverInfo.json"
```
{
  "smtp" : {
    "host" : "smtp.gmail.com",
    "port" : 465,
    "auth" : {
      
      "user" : "",
      "pass" : ""
    }
  },
  "imap" : {
    "host" : "imap.gmail.com",
    "port" : 993,
    "auth" : {
      "user" : "",
      "pass" : ""
    }
  }
}
```
Then, run the project by following command line
```
npm run dev
```

There are several usages that you can use:
- Send mail
```
curl -d '{"to":"v4550121@yahoo.com.tw","from":"k03id2596@gmail.com","subject":"test2","message":"hihihihihihiihih"}' -H "Content-Type:application/json" -X POST localhost:3250/messages
```
- Look into the mail box
```
curl localhost:3250/mailboxes
```
- Look into the specific folder of the mailbox
```
curl localhost:3250/mailboxes/demo
```
- Look into the specific mail in the folder
```
curl localhost:3250/messages/demo/3
```
- Delete the specific mail
```
curl -X DELETE localhost:3250/messages/demo/3
```
