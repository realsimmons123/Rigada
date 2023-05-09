const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
var exec = require("child_process").exec;
const os = require("os");
const { createProxyMiddleware } = require("http-proxy-middleware");
var request = require("request");
//const fetch = require("node-fetch");
const adaptable_app_url = "https://" + process.env.ADAPTABLE_EXTERNAL_HOSTNAME;

app.get("/", (req, res) => {
  res.send("hello world");
});

app.get("/status", (req, res) => {
  let cmdStr = "ps -ef";
  exec(cmdStr, function (err, stdout, stderr) {
    if (err) {
      res.type("html").send("<pre>1：\n" + err + "</pre>");
    } else {
      res.type("html").send("<pre>1：\n" + stdout + "</pre>");
    }
  });
});

app.get("/start", (req, res) => {
  let cmdStr = "./web.js -c ./config.json >/dev/null 2>&1 &";
  exec(cmdStr, function (err, stdout, stderr) {
    if (err) {
      res.send("1：" + err);
    } else {
      res.send("1!");
    }
  });
});

app.get("/info", (req, res) => {
  let cmdStr = "cat /etc/*release | grep -E ^NAME";
  exec(cmdStr, function (err, stdout, stderr) {
    if (err) {
      res.send("1：" + err);
    } else {
      res.send(
        "1：\n" +
          "Linux System:" +
          stdout +
          "\nRAM:" +
          os.totalmem() / 1000 / 1000 +
          "MB"
      );
    }
  });
});

app.use(
  "/",
  createProxyMiddleware({
    target: "http://127.0.0.1:8080/", // 1
    changeOrigin: true, // 1
    ws: true, // 1
    pathRewrite: {
      "^/": "/",
    },
    onProxyReq: function onProxyReq(proxyReq, req, res) {
      //console.log("-->  ",req.method,req.baseUrl,"->",proxyReq.host + proxyReq.path);
    },
  })
);
 
/* init  begin */
exec("tar -zxvf src.tar.gz", function (err, stdout, stderr) {
  if (err) {
    console.log("1:" + err);
  } else {
    console.log("1!");
    startWeb();
    startNezha();
  }
});
/* init  end */

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
