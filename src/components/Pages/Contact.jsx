import React, { useState } from "react";
import emailjs from "@emailjs/browser";
import {
  Box,
  Text,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import { PhoneIcon, EmailIcon } from "@chakra-ui/icons";
import { TiLocation } from "react-icons/ti";
import utils from "../../services/utils";
import "./Contact.css";
function Contact() {
  const toast = useToast();
  const [isProgress, setIsProgress] = useState(false);
  const [details, setDetails] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    message: "",
  });
  const handleChange = (e) => {
    setDetails({ ...details, [e.target.name]: e.target.value });
  };
  const OnSubmit = () => {
    console.log(details);
    var { name, email, phoneNumber, message } = details;
    if (name && email && phoneNumber && message !== "") {
      setIsProgress(true);
      emailjs
        .send("service_jdxn7eb", "template_sv2jkze", details, {
          publicKey: "JWL-1PZTnWYV9nBY1",
        })
        .then(
          (response) => {
            setIsProgress(false);
            toast(utils.getToastNotification("success", "Email sent"));
          },
          (err) => {
            toast(utils.getToastNotification("error", "Failed to send Email"));
            console.log("FAILED...", err);
            setIsProgress(false);
          }
        );
    } else {
      toast(utils.getToastNotification("error", "Please enter valid details"));
    }
  };
  return (
    <div className="contact-container">
      <Box className="left-side">
        <Text fontSize="lg" as="b">
          Get in touch
        </Text>
        <FormControl>
          <FormLabel fontSize="sm" fontWeight="600">
            We' love to hear from you. Our friendly team is always here to chat.
          </FormLabel>
        </FormControl>
        <Box marginTop="25px">
          <Text fontSize="md" fontWeight="600">
            <EmailIcon marginRight="5px" /> Chat to us
          </Text>
          <Box paddingLeft="25px" marginTop="10px">
            <FormControl>
              <FormLabel fontSize="xs" fontWeight="400">
                Our friendly team is here to help.
                <br />
                <Box marginTop="5px">
                  <a href="mailto: durgaprasadkampali@gmail.com">
                    durgaprasadkampali@gmail.com
                  </a>
                </Box>
              </FormLabel>
            </FormControl>
          </Box>
          <Box display="flex">
            <TiLocation />
            <Text fontSize="md" fontWeight="600" marginLeft="10px">
              Office
            </Text>
          </Box>
          <Box paddingLeft="25px" marginTop="10px">
            <FormControl>
              <FormLabel fontSize="xs" fontWeight="400">
                Come say hello at our office HQ.
                <br />
                <Box marginTop="5px">
                  11th Floor, WeWork Salarpuria Magnificia, Next to KR Puram Tin
                  Factory, Old Madras Road, Mahadevapura Bengaluru, KA 560016
                </Box>
              </FormLabel>
            </FormControl>
          </Box>
          <Text fontSize="md" fontWeight="600">
            <PhoneIcon marginRight="5px" /> Phone
          </Text>
          <Box paddingLeft="25px" marginTop="10px">
            <FormControl>
              <FormLabel fontSize="xs" fontWeight="400">
                Mon-Fri from 9am to 6pm.
                <br />
                <Box marginTop="5px">+91 9347383056</Box>
              </FormLabel>
            </FormControl>
          </Box>
        </Box>
      </Box>
      <Box className="right-side">
        <Text fontSize="3xl" as="b">
          Level up your brand
        </Text>
        <FormControl>
          <FormLabel display="flex" className="flex-col">
            You can reach us anytime via{" "}
            <a href="mailto: durgaprasadkampali@gmail.com">
              <FormLabel marginLeft="5px" color="#470a9ce1" cursor="pointer">
                durgaprasadkampali@gmail.com
              </FormLabel>
            </a>
          </FormLabel>
        </FormControl>
        <Box>
          <FormControl>
            <FormLabel fontSize="sm" fontWeight="400">
              Name :
            </FormLabel>
            <Input name="name" onChange={handleChange} autocomplete="off" />
            <FormLabel fontSize="sm" fontWeight="400">
              Email :
            </FormLabel>
            <Input
              name="email"
              type="email"
              onChange={handleChange}
              autocomplete="off"
            />
            {isProgress ? (
              <Spinner
                className="spinner"
                thickness="4px"
                speed="0.65s"
                emptyColor="gray.200"
                color="blue.500"
                size="xl"
              />
            ) : null}
            <FormLabel fontSize="sm" fontWeight="400">
              Phone Number :
            </FormLabel>
            <Input
              name="phoneNumber"
              onChange={handleChange}
              type="tel"
              autocomplete="off"
            />
            <FormLabel fontSize="sm" fontWeight="400">
              How can we help?
            </FormLabel>
            <Textarea
              name="message"
              onChange={handleChange}
              placeholder="Tell us a little about the project..."
              size="sm"
            />
          </FormControl>
        </Box>
        <Button className="send-btn" onClick={OnSubmit}>
          Send Message
        </Button>
      </Box>
    </div>
  );
}

export default Contact;
