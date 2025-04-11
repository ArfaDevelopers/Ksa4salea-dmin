// utils/firebaseAdmin.js
import * as admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: "ksa4sale-classified",
      clientEmail: "YOUR_CLIENT_EMAIL",
      privateKey: "AIzaSyCpWI_HWbfKk6La4hG_ILEPXvgNj__NbyE".replace(
        /\\n/g,
        "\n"
      ),
    }),
  });
}

export const verifyIdToken = async (token) => {
  return await admin.auth().verifyIdToken(token);
};
