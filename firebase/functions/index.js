const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
const cors = require('cors')({origin: true});
admin.initializeApp();

/**
 * Here we're using Gmail to send
 */
let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'dream.dev1215@gmail.com',
    pass: 'qapvozeqidrnescw',
  },
});
// // Create and deploy your first functions
// // https://firebase.google.com/docs/functions/get-started
//
exports.sendMail = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    // getting dest email by query string
    const dest = req.query.dest;
    const code = req.query.code;
    const data =
      '<html><body>アカウント登録のリクエストを受け付けました。<br>アカウント登録を完了するには、アプリ内で次の認証コードをご入力ください。<br>' +
      code +
      '<br><br>======================        ' +
      '<br>※本メールは送信専用アドレスから配信しています。本メールに直接返信いただいても回答できませんのでご注意ください。' +
      '<br>======================</body><html>';

    const mailOptions = {
      from: 'Okyuin <dream.dev1215@gmail.com>', // Something like: Jane Doe <janedoe@gmail.com>
      to: dest,
      subject: "'【Okyuin】メール認証コードのお知らせ", // email subject
      html: data, // email content in HTML
    };

    // returning result
    return transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        if (error.status === 200) {
          return res.send('Sended');
        }
        return res.send(error.toString());
      }
      return res.send('Sended');
    });
  });
});

exports.handleMessage = functions.firestore
  .document('ChatMessages/{messageId}')
  .onCreate(async snapshot => {
    // Notification details.
    const receiver_id = snapshot.data().receiver;
    const sender_id = snapshot.data().sender;
    const text = snapshot.data().text;
    const receiver_data = (
      await admin.firestore().collection('Users').doc(receiver_id).get()
    ).data();
    const sender_data = (
      await admin.firestore().collection('Users').doc(sender_id).get()
    ).data();

    const payload = {
      notification: {
        title: `おきゅいん`,
        body: text
          ? text.length <= 100
            ? text
            : text.substring(0, 97) + '...'
          : '',
      },
      android: {
        notification: {
          image:
            'https://firebasestorage.googleapis.com/v0/b/okyuin-akiba.appspot.com/o/Android.png?alt=media&token=7834b6bd-fba6-45c8-8f3d-5e9ea00da8d1',
        },
      },
      apns: {
        payload: {
          aps: {
            'mutable-content': 1, // 1 or true
          },
        },
        fcm_options: {
          image:
            'https://firebasestorage.googleapis.com/v0/b/okyuin-akiba.appspot.com/o/iphone.png?alt=media&token=65513db5-a36a-4b36-9fbb-8340bc8c1075',
        },
      },
    };

    if (receiver_data.fcmToken) {
      // Send notifications to all tokens.
      const response = await admin
        .messaging()
        .sendToDevice([receiver_data.fcmToken], payload);
      functions.logger.log(
        'Notifications have been sent and tokens cleaned up.',
      );
    }
  });

exports.handleSuperLike = functions.firestore
  .document('Relations/{relationId}')
  .onCreate(async snapshot => {
    // Notification details.
    const user1 = snapshot.data().user1;
    const user2 = snapshot.data().user2;
    const relation1 = snapshot.data().relation1;
    const relation2 = snapshot.data().relation2;
    if (relation1 === 3 || relation2 === 3) {
      const receiver_data = (
        await admin
          .firestore()
          .collection('Users')
          .doc(relation1 === 3 ? user2 : user1)
          .get()
      ).data();
      const sender_data = (
        await admin
          .firestore()
          .collection('Users')
          .doc(relation1 === 3 ? user1 : user2)
          .get()
      ).data();
      const text = `${sender_data.name} sent Favorite to ${receiver_data.name}`;
      const payload = {
        notification: {
          title: `おきゅいん`,
          body: text
            ? text.length <= 100
              ? text
              : text.substring(0, 97) + '...'
            : '',
        },
        data: {
          sender_id: relation1 === 3 ? user1 : user2,
          relation_id: snapshot.id,
        },
        android: {
          notification: {
            image:
              'https://firebasestorage.googleapis.com/v0/b/okyuin-akiba.appspot.com/o/Android.png?alt=media&token=7834b6bd-fba6-45c8-8f3d-5e9ea00da8d1',
          },
        },
        apns: {
          payload: {
            aps: {
              'mutable-content': 1, // 1 or true
            },
          },
          fcm_options: {
            image:
              'https://firebasestorage.googleapis.com/v0/b/okyuin-akiba.appspot.com/o/iphone.png?alt=media&token=65513db5-a36a-4b36-9fbb-8340bc8c1075',
          },
        },
      };

      if (receiver_data.fcmToken) {
        // Send notifications to all tokens.
        const response = await admin
          .messaging()
          .sendToDevice([receiver_data.fcmToken], payload, {
            // Required for background/quit data-only messages on iOS
            contentAvailable: true,
            // Required for background/quit data-only messages on Android
            priority: 'high',
          });
        functions.logger.log(
          'Notifications have been sent and tokens cleaned up.',
        );
      }
    }
  });
