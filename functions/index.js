const { onValueCreated } = require("firebase-functions/v2/database");
const admin = require("firebase-admin");

admin.initializeApp();

exports.sendNewOrderNotification = onValueCreated(
  "/orders/{orderId}",
  async (event) => {
    const orderData = event.data.val();
    if (!orderData) return;

    const fullOrderId = event.params.orderId;
    const partyName = orderData.partyName || orderData.customerName || "Customer";
    const photoUrl = orderData.photoUrl || orderData.imageUrl || "";

    const tokensSnapshot = await admin.database().ref("admin_tokens").once("value");
    const tokensData = tokensSnapshot.val();
    
    if (!tokensData) {
      console.log("No admin tokens found in admin_tokens node.");
      return;
    }

    const tokens = Object.keys(tokensData);

    const message = {
      notification: {
        title: `Order #${fullOrderId}`,
        body: `${partyName} placed order`,
        image: photoUrl
      },
      tokens: tokens
    };

    try {
      const response = await admin.messaging().sendEachForMulticast(message);
      console.log(`Successfully sent order #${fullOrderId} notification to ${response.successCount} devices.`);
    } catch (error) {
      console.error("Error sending push notification:", error);
    }
  }
);
