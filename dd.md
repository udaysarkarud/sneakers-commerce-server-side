        app.post('/send-confirmation-email', async (req, res) => {
            const mailInfo = req.body;
            console.log(mailInfo)

            const transporter = nodemailer.createTransport({
                host: 'smtp.ethereal.email',
                port: 587,
                auth: {
                    user: 'ea7ynaahiwacmynr@ethereal.email',
                    pass: '9SPTtNVEcs1z8YkcAE'
                }
            });

            // send mail with defined transport object
            let info = await transporter.sendMail({
                from: 'ea7ynaahiwacmynr@ethereal.email', // sender address
                to: `${mailInfo.clientEmail}`, // list of receivers
                subject: "Order confirmation from sneaker.com", // Subject line
                text: `Dear ${mailInfo.clientName}, We are happy to let you know that we have received your order.Your order details can be found below. Once your package ships, we will send you an email with a confirm so you can see the movement of your package. Order Number: ${mailInfo.orderId}, Order Date</b>: ${mailInfo.orderDate}</p><p><b>Order Total</b>: ${mailInfo.totalAmount}</p><p><b>Payment ID</b>: ${mailInfo.paymentid}</p><p><b>SHIPPING ADDRESS</b>: ${mailInfo.clientAddress}</p><br/><p>You can review your order status at any time by visiting Your Account. We hope you enjoyed your shopping experience with us and that you will visit us again soon.If you have any questions, contact us here or call us on +8801711227383.We are here to help!</p>`, // plain text body
                html: `<p>Dear <b>${mailInfo.clientName},</b></p><p>We are happy to let you know that we have received your order.Your order details can be found below. Once your package ships, we will send you an email with a confirm so you can see the movement of your package.</p><br/><p><u>ORDER SUMMARY</u></p><p><b>Order Number:</b> ${mailInfo.orderId}</p><p><b>Order Date</b>: ${mailInfo.orderDate}</p><p><b>Order Total</b>: ${mailInfo.totalAmount}</p><p><b>Payment ID</b>: ${mailInfo.paymentid}</p><p><b>SHIPPING ADDRESS</b>: ${mailInfo.clientAddress}</p><br/><p>You can review your order status at any time by visiting Your Account. We hope you enjoyed your shopping experience with us and that you will visit us again soon.If you have any questions, contact us here or call us on +8801711227383.We are here to help!</p>` // html body
            });

            console.log("Message sent: %s", info.messageId);

        })