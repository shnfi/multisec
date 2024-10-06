import express from 'express';
import logger from './middleware/logger.js';
import path from 'path';
import bodyParser from 'body-parser';
import userModel from './models/userSchema.js';
import crypto from 'crypto';
import cookieParser from 'cookie-parser';

const router = express.Router();

const __dirname = path.dirname(path.resolve('.'));

router.use(express.static("public"));
router.use(express.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(cookieParser());

router.route("/").get((req, res) => {
   logger(req, res, () => {
      res.set({
         "Strict-Transport-Security": "max-age=31546000; includeSubDomains; preload",
         "X-XSS-Protection": "1; mode=block",
         "X-Content-Type-Options": "nosniff",
         "Content-Security-Policy": "script-src 'self'",
      }).status(301).redirect("/signin");
   })
});

router.route("/signin").get((req, res) => {
   logger(req, res, () => {
      const tmp = path.join(__dirname, "MultiSec", "public", "signin.html");
      res.set({
         "Strict-Transport-Security": "max-age=31546000; includeSubDomains; preload",
         "X-XSS-Protection": "1; mode=block",
         "X-Content-Type-Options": "nosniff",
         "Content-Security-Policy": "script-src 'self'",
      }).status(200).sendFile(tmp);
   })
});

router.route("/api/v1/userAuthentication").post((req, res) => {
   logger(req, res, async () => {
      const checkingForUserExistenceWithUsername = await userModel.findOne({ username: req.body.username });

      let terminalLoginAttempErrorsCount = 0;

      if (!checkingForUserExistenceWithUsername) { terminalLoginAttempErrorsCount++ }
      if (req.body.username === "") { terminalLoginAttempErrorsCount++ }

      if (terminalLoginAttempErrorsCount >= 1) { res.set({
         "Strict-Transport-Security": "max-age=31546000; includeSubDomains; preload",
         "X-XSS-Protection": "1; mode=block",
         "X-Content-Type-Options": "nosniff",
         "Content-Security-Policy": "script-src 'self'",
      }).send("There is 1 or more error while proceding the authentication task!"); return }

      res.set({
         "Strict-Transport-Security": "max-age=31546000; includeSubDomains; preload",
         "X-XSS-Protection": "1; mode=block",
         "X-Content-Type-Options": "nosniff",
         "Content-Security-Policy": "script-src 'self'",
      }).cookie("message", "yo");

      res.set({
         "Strict-Transport-Security": "max-age=31546000; includeSubDomains; preload",
         "X-XSS-Protection": "1; mode=block",
         "X-Content-Type-Options": "nosniff",
         "Content-Security-Policy": "script-src 'self'",
      }).status(301).redirect("/dashboard");
   })
});

router.route("/dashboard").get((req, res) => {
   logger(req, res, () => {
      const { cookies } = req;
      
      if (cookies.message) {
         const tmp = path.join(__dirname, "MultiSec", "public", "signed_in.html");
         res.set({
            "Strict-Transport-Security": "max-age=31546000; includeSubDomains; preload",
            "X-XSS-Protection": "1; mode=block",
            "X-Content-Type-Options": "nosniff",
            "Content-Security-Policy": "script-src 'self'",
         }).status(200).sendFile(tmp);
      } else { res.set({
         "Strict-Transport-Security": "max-age=31546000; includeSubDomains; preload",
         "X-XSS-Protection": "1; mode=block",
         "X-Content-Type-Options": "nosniff",
         "Content-Security-Policy": "script-src 'self'",
      }).status(401).redirect("/userError?et=noAuth"); }
   })
});

router.route("/userError").get((req, res) => {
   logger(req, res, () => {
      const theErrorTopicFromQuery = req.query.et;

      switch (theErrorTopicFromQuery) { // i used switch case statement for enabling myself to handle more user errors easily . 
         case "noAuth":
            const tmp = path.join(__dirname, "MultiSec", "public", "noAuth_er.html");
            res.set({
               "Strict-Transport-Security": "max-age=31546000; includeSubDomains; preload",
               "X-XSS-Protection": "1; mode=block",
               "X-Content-Type-Options": "nosniff",
               "Content-Security-Policy": "script-src 'self'",
            }).status(200).sendFile(tmp);
            break;
         
         default:
            break;
      }
   })
});

router.route("/api/v1/checkAuth").post((req, res) => {
   logger(req, res, async () => {
      const _PU = req.body.possible_username;
      const _PP = req.body.possible_password;

      const checkingForUserExistenceWithUsername = await userModel.findOne({ username: _PU });
      const checkingForUserExistenceWithEmail= await userModel.findOne({ email: _PU });

      crypto.randomBytes(10, (e, peper) => {
         if (checkingForUserExistenceWithUsername) {
            try {
               const hashedPassword = crypto.createHash("sha256").update(_PP).digest("hex");
               const saltedPassword = crypto.createHash("sha256").update(hashedPassword + checkingForUserExistenceWithUsername.salt).digest("hex");

               res.set({
                  "Strict-Transport-Security": "max-age=31546000; includeSubDomains; preload",
                  "X-XSS-Protection": "1; mode=block",
                  "X-Content-Type-Options": "nosniff",
                  "Content-Security-Policy": "script-src 'self'",
               }).json({
                  valid_usr: true,
                  valid_pas: crypto.createHash("sha256").update(saltedPassword + peper.toString("hex")).digest("hex") === crypto.createHash("sha256").update(checkingForUserExistenceWithUsername.password + peper.toString("hex")).digest("hex"),
               }); return;
            } catch (er) {
               res.set({
                  "Strict-Transport-Security": "max-age=31546000; includeSubDomains; preload",
                  "X-XSS-Protection": "1; mode=block",
                  "X-Content-Type-Options": "nosniff",
                  "Content-Security-Policy": "script-src 'self'",
               }).json("one or more error while fetching the request!");
            }
         } else {
            if (checkingForUserExistenceWithEmail) {
               try {
                  const hashedPassword = crypto.createHash("sha256").update(_PP).digest("hex");
                  const saltedPassword = crypto.createHash("sha256").update(hashedPassword + checkingForUserExistenceWithEmail.salt).digest("hex");
               } catch (er) {
                  res.set({
                     "Strict-Transport-Security": "max-age=31546000; includeSubDomains; preload",
                     "X-XSS-Protection": "1; mode=block",
                     "X-Content-Type-Options": "nosniff",
                     "Content-Security-Policy": "script-src 'self'",
                  }).json("one or more error while fetching the request!");
               }

               res.set({
                  "Strict-Transport-Security": "max-age=31546000; includeSubDomains; preload",
                  "X-XSS-Protection": "1; mode=block",
                  "X-Content-Type-Options": "nosniff",
                  "Content-Security-Policy": "script-src 'self'",
               }).json({
                  valid_usr: true,
                  valid_pas: crypto.createHash("sha256").update(saltedPassword + peper.toString("hex")).digest("hex") === crypto.createHash("sha256").update(checkingForUserExistenceWithEmail.password + peper.toString("hex")).digest("hex"),
               }); return;
            } else {
               res.set({
                  "Strict-Transport-Security": "max-age=31546000; includeSubDomains; preload",
                  "X-XSS-Protection": "1; mode=block",
                  "X-Content-Type-Options": "nosniff",
                  "Content-Security-Policy": "script-src 'self'",
               }).json({
                  valid_usr: false,
                  valid_pas: false,
               }); return;
            }
         }
      })
   })
});

router.route("/signup").get((req, res) => {
   logger(req, res, () => {
      const tmp = path.join(__dirname, "MultiSec", "public", "signup.html");
      res.set({
         "Strict-Transport-Security": "max-age=31546000; includeSubDomains; preload",
         "X-XSS-Protection": "1; mode=block",
         "X-Content-Type-Options": "nosniff",
         "Content-Security-Policy": "script-src 'self'",
      }).status(200).sendFile(tmp);
   })
});

router.route("/api/v1/userRegisteration").post((req, res) => {
   logger(req, res, () => {
      crypto.randomBytes(10, (e, peper) => {
         if (e) throw e.message;

         crypto.randomBytes(10, async (e, salt) => {
            if (e) throw e.message;
   
            const hashedPassword = crypto.createHash("sha256").update(req.body.password).digest("hex");
            const saltedPassword = crypto.createHash("sha256").update(hashedPassword + salt.toString("hex")).digest("hex");
            const peperedPassword = crypto.createHash("sha256").update(saltedPassword + peper.toString("hex")).digest("hex");
            
            const checkingForUserExistenceWithUsername = await userModel.findOne({ username: req.body.username });
            const checkingForUserExistenceWithEmail = await userModel.findOne({ email: req.body.email });

            let terminalLoginAttempErrorsCount = 0;

            if (checkingForUserExistenceWithUsername) { terminalLoginAttempErrorsCount++ }
            if (checkingForUserExistenceWithEmail) { terminalLoginAttempErrorsCount++ }
            if (req.body.username === "") { terminalLoginAttempErrorsCount++ }
            if (req.body.email.indexOf("@") === -1) { terminalLoginAttempErrorsCount++ }
            if (isNaN(req.body.phoneNum) || req.body.phoneNum.length === 0) { terminalLoginAttempErrorsCount++ }
            if (req.body.password.length < 5 || req.body.repassword.length < 5) { terminalLoginAttempErrorsCount++ }
            if (req.body.password !== req.body.repassword) { terminalLoginAttempErrorsCount++ }

            if (terminalLoginAttempErrorsCount >= 1) { res.set({
               "Strict-Transport-Security": "max-age=31546000; includeSubDomains; preload",
               "X-XSS-Protection": "1; mode=block",
               "X-Content-Type-Options": "nosniff",
               "Content-Security-Policy": "script-src 'self'",
            }).send("There is 1 or more error while proceding the registeration task!"); return }

            const enteringUserInformation = {
               username: req.body.username,
               email: req.body.email,
               phoneNum: req.body.phoneNum,
               password: saltedPassword,
               salt: salt.toString("hex"),
            }

            const userCreationFromPostedData = await userModel.create(enteringUserInformation);

            res.set({
               "Strict-Transport-Security": "max-age=31546000; includeSubDomains; preload",
               "X-XSS-Protection": "1; mode=block",
               "X-Content-Type-Options": "nosniff",
               "Content-Security-Policy": "script-src 'self'",
            }).status(201).redirect("/signin");
         });
      })
   })
});

router.route("/api/v1/checkEx").post((req, res) => {
   logger(req, res, async () => {
      const queryString_UNM = req.body.unm;
      const queryString_EML = req.body.eml;

      const checkingForUserExistenceWithUsername = await userModel.findOne({ username: queryString_UNM });
      const checkingForUserExistenceWithEmail = await userModel.findOne({ email: queryString_EML });

      const message = {
         unm_code: checkingForUserExistenceWithUsername ? 1 : 0,
         eml_code: checkingForUserExistenceWithEmail ? 1 : 0,
      };

      res.set({
         "Strict-Transport-Security": "max-age=31546000; includeSubDomains; preload",
         "X-XSS-Protection": "1; mode=block",
         "X-Content-Type-Options": "nosniff",
         "Content-Security-Policy": "script-src 'self'",
      }).json(message);
   })
});

// end of endpoints, do not add end point after this note!

router.route("*").all((req, res) => {
   logger(req, res, () => {
      const tmp = path.join(__dirname, "MultiSec", "public", "404.html");
      res.set({
         "Strict-Transport-Security": "max-age=31546000; includeSubDomains; preload",
         "X-XSS-Protection": "1; mode=block",
         "X-Content-Type-Options": "nosniff",
         "Content-Security-Policy": "script-src 'self'",
      }).status(404).sendFile(tmp);
   })
});

export default router;