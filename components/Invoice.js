import React, { useEffect } from "react";
import { View, Text, StyleSheet, Image, Alert, Dimensions } from "react-native";
import { RNSlidingButton, SlideDirection } from "rn-sliding-button";
import firebaseSDK from "../config/firebaseSDK";
import firebase from "firebase";
import axios from "axios";
import { GiftedChat } from "react-native-gifted-chat";

export default function Invoice(props) {
	useEffect(() => {
		setTimeout(async function () {
			await firebaseSDK.markIsTimeout(props.chatKey, props.message_id);
			let messages = await firebaseSDK.getChatOnce(props.chatKey);
			props.setMessages(GiftedChat.append([], messages.reverse()));
		}, 30000);
	});

	const windowWidth = Dimensions.get("window").width;
	const windowHeight = Dimensions.get("window").height;

	const resizeWidth = (w) => {
		return (value = w * (windowWidth / 375));
	};

	const resizeHeight = (h) => {
		return (value = h * (windowHeight / 872));
	};
	const getCurrentUserDetails = () => {
		const userDetails = firebaseSDK.getAccountDetails();

		let name = userDetails.split(",")[0];
		let email = userDetails.split(",")[1];
		let id = userDetails.split(",")[2];

		return {
			name: name,
			email: email,
			avatar: "",
			id: id,
			_id: id,
		};
	}

	const onSlideRightGenerator = (invoice_id, message_id, message_text) => {
		// add in props
		let onSlideRight = async () => {
			//perform Action on slide success.
			props.setLoading(true);
			var merchantName = message_text.split("\n")[1].split(": ")[1];
			var buyerName = message_text.split("\n")[2].split(": ")[1];
			var productName = message_text.split("\n")[3].split(": ")[1];
			var priceAmount = message_text.split("\n")[4].split(": ")[1];

			var makePaymentAPI =
				"https://khanhphungntu.ml/make_payment/" + invoice_id.toString();

			const idToken = await firebase.auth().currentUser.getIdToken(true);

			try {
				const response = await axios.post(
					makePaymentAPI,
					{},
					{
						headers: { Authorization: idToken },
					}
				);

				await firebaseSDK.markIsPaid(props.chatKey, message_id);
				console.log("marked paid");

				let ReceiptToSend =
					"Transaction ID: " +
					response.data.transaction_id +
					"\nInvoice ID: " +
					invoice_id +
					"\nMerchant: " +
					merchantName +
					"\nBuyer: " +
					buyerName +
					"\nProduct: " +
					productName +
					"\nPrice: " +
					priceAmount;

				// console.log("Receipt: " + ReceiptToSend);

				await firebaseSDK.sendReceiptMessage(props.chatKey, {
					user: getCurrentUserDetails(),
					text: ReceiptToSend,
				});
				console.log("added receipt");
				props.setLoading(false);
				Alert.alert(
					"Payment Successful!\nTransaction ID: " + response.data.transaction_id
				);

				let messages = await firebaseSDK.getChatOnce(props.chatKey);
				props.setMessages(GiftedChat.append([], messages));
			} catch (error) {
				console.log("!!!!!!!!!!!!!ERROR!!!!!!!!!!!!!!");
				console.log(error);
				setLoading(false);
				Alert.alert("Payment Failed. Please try again.");
			}
		};

		return onSlideRight;
	};

	if (props.currentMessage.user.id == firebaseSDK.getCurrentUserUid()) {
		return (
			<View>
				<Text style={styles.PaymentText}>Invoice Details</Text>
			</View>
		);
	} else {
		// buyer
		return (
			<View>
				<Text style={styles.PaymentText2}>Invoice Details</Text>
				<RNSlidingButton
					style={{
						width: "100%",
					}}
					height={resizeHeight(35)}
					onSlidingSuccess={() => onSlideRightGenerator(
						props.invoice_id,
						props.message_id,
						props.message_text
					)}
					slideDirection={SlideDirection.RIGHT}
					successfulSlidePercent={90}
				>
					<Image
						source={require("../../ChatAppV2/assets/SwipeGradientUpdated.png")}
						style={{
							flex: 1,
							position: "absolute",
							width: "100%",
							height: "100%",
							alignSelf: "center",
						}}
					></Image>

					<Image
						source={
							props.uri
								? { uri: props.uri }
								: require("../assets/visaCardIcon3.png")
						}
						style={{
							height: resizeHeight(38),
							width: resizeWidth(48),
							resizeMode: "stretch",
						}}
					/>
				</RNSlidingButton>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	PaymentText: {
		fontSize: 18,
		color: "#FFFFFF",
		textAlign: "center",
	},

	PaymentText2: {
		fontSize: 18,
		color: "#000000",
		textAlign: "center",
	},

});
