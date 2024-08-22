"use client";
import React, { useState } from "react";
import {
  Steps,
  Button,
  Form,
  Input,
  InputNumber,
  Checkbox,
  Typography,
  Space,
  Card,
  message,
} from "antd";
import {
  UserOutlined,
  SafetyOutlined,
  HomeOutlined,
  PhoneOutlined,
  MailOutlined,
} from "@ant-design/icons";
import Image from "next/image";
import verfication4 from "../../../../../../public/images/verification4.gif";
import axiosInstance from "@/app/hooks/useApi";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

const { Step } = Steps;
const { Title } = Typography;

const DoctorSignupForm: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get('email');
  const [currentStep, setCurrentStep] = useState(0);
  const [formValues, setFormValues] = useState({
    specialization: "",
    licenseNumber: "",
    certificationDetails: "",
    yearsOfExperience: "",
    residentialAddress: "",
    practiceAddress: "",
    workingHours: "",
    consultationTypes: [],
    alternativePhoneNumber: "",
    alternateEmail: "",
    bio: "",
    onCallAvailability: "",
  });

  
  const steps = [
    {
      title: "Personal Information",
      content: (
        <Card
          bordered={false}
          className="p-6 bg-white shadow-lg rounded-lg transition-transform transform hover:scale-105"
        >
          <Form.Item
            name="specialization"
            label="Specialization"
            rules={[
              { required: true, message: "Please input your specialization!" },
              { min: 2, message: "Specialization must be at least 2 characters long" },
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Enter your specialization"
              className="bg-gray-50 rounded-lg"
              value={formValues.specialization}
              onChange={(e) =>
                setFormValues({ ...formValues, specialization: e.target.value })
              }
            />
          </Form.Item>
          <Form.Item
            name="licenseNumber"
            label="License Number"
            rules={[
              { required: true, message: "Please input your license number!" },
              { pattern: /^[A-Z0-9]{5,15}$/, message: "License number must be 5-15 alphanumeric characters" },
            ]}
          >
            <Input
              prefix={<SafetyOutlined />}
              placeholder="Enter your license number"
              className="bg-gray-50 rounded-lg"
              value={formValues.licenseNumber}
              onChange={(e) =>
                setFormValues({ ...formValues, licenseNumber: e.target.value })
              }
            />
          </Form.Item>
          <Form.Item 
            name="certificationDetails" 
            label="Certification Details"
            rules={[
              { max: 500, message: "Certification details cannot exceed 500 characters" },
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Enter certification details (optional)"
              className="bg-gray-50 rounded-lg"
              value={formValues.certificationDetails}
              onChange={(e) =>
                setFormValues({
                  ...formValues,
                  certificationDetails: e.target.value,
                })
              }
            />
          </Form.Item>
          <Form.Item 
            name="yearsOfExperience" 
            label="Years of Experience"
            rules={[
              { type: 'number', min: 0, max: 100, message: "Years of experience must be between 0 and 100" },
            ]}
          >
            <InputNumber
              placeholder="Enter years of experience (optional)"
              style={{ width: "100%" }}
              className="bg-gray-50 rounded-lg"
              value={formValues.yearsOfExperience}
              onChange={(value) =>
                setFormValues({
                  ...formValues,
                  yearsOfExperience: value ? value.toString() : "",
                })
              }
            />
          </Form.Item>
        </Card>
      ),
    },
    {
      title: "Professional Details",
      content: (
        <Card
          bordered={false}
          className="p-6 bg-white shadow-lg rounded-lg transition-transform transform hover:scale-105"
        >
          <Form.Item
            name="residentialAddress"
            label="Residential Address"
            rules={[
              { required: true, message: "Please input your residential address!" },
              { min: 10, message: "Address must be at least 10 characters long" },
            ]}
          >
            <Input
              prefix={<HomeOutlined />}
              placeholder="Enter residential address"
              className="bg-gray-50 rounded-lg"
              value={formValues.residentialAddress}
              onChange={(e) =>
                setFormValues({
                  ...formValues,
                  residentialAddress: e.target.value,
                })
              }
            />
          </Form.Item>
          <Form.Item
            name="practiceAddress"
            label="Practice Address"
            rules={[
              { required: true, message: "Please input your practice address!" },
              { min: 10, message: "Address must be at least 10 characters long" },
            ]}
          >
            <Input
              prefix={<HomeOutlined />}
              placeholder="Enter practice address"
              className="bg-gray-50 rounded-lg"
              value={formValues.practiceAddress}
              onChange={(e) =>
                setFormValues({
                  ...formValues,
                  practiceAddress: e.target.value,
                })
              }
            />
          </Form.Item>
          <Form.Item 
            name="workingHours" 
            label="Working Hours"
            rules={[
              { required: true, message: "Please input your working hours!" },
              { pattern: /^([01]?[0-9]|2[0-3]):[0-5][0-9] - ([01]?[0-9]|2[0-3]):[0-5][0-9]$/, message: "Please use format HH:MM - HH:MM" },
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Enter working hours (e.g. 09:00 - 17:00)"
              className="bg-gray-50 rounded-lg"
              value={formValues.workingHours}
              onChange={(e) =>
                setFormValues({ ...formValues, workingHours: e.target.value })
              }
            />
          </Form.Item>
          <Form.Item
            name="consultationTypes"
            label="Consultation Types"
            rules={[
              { required: true, message: "Please select at least one consultation type!" },
            ]}
          >
            <Checkbox.Group
              value={formValues.consultationTypes}
              onChange={(values) =>
                setFormValues({ ...formValues, consultationTypes: values })
              }
            >
              <Space direction="vertical">
                <Checkbox value="in-person">In-Person</Checkbox>
                <Checkbox value="online">Online</Checkbox>
              </Space>
            </Checkbox.Group>
          </Form.Item>
        </Card>
      ),
    },
    {
      title: "Additional Information",
      content: (
        <Card
          bordered={false}
          className="p-6 bg-white shadow-lg rounded-lg transition-transform transform hover:scale-105"
        >
          <Form.Item
            name="alternativePhoneNumber"
            label="Alternative Phone Number"
            rules={[
              { pattern: /^[0-9]{10}$/, message: "Please enter a valid 10-digit phone number" },
            ]}
          >
            <Input
              prefix={<PhoneOutlined />}
              placeholder="Enter alternative phone number"
              className="bg-gray-50 rounded-lg"
              value={formValues.alternativePhoneNumber}
              onChange={(e) =>
                setFormValues({
                  ...formValues,
                  alternativePhoneNumber: e.target.value,
                })
              }
            />
          </Form.Item>
          <Form.Item 
            name="alternateEmail" 
            label="Alternate Email"
            rules={[
              { type: 'email', message: "Please enter a valid email address" },
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="Enter alternate email address"
              className="bg-gray-50 rounded-lg"
              value={formValues.alternateEmail}
              onChange={(e) =>
                setFormValues({ ...formValues, alternateEmail: e.target.value })
              }
            />
          </Form.Item>
          <Form.Item 
            name="bio" 
            label="Bio"
            rules={[
              { max: 1000, message: "Bio cannot exceed 1000 characters" },
            ]}
          >
            <Input.TextArea
              placeholder="Enter a short bio"
              rows={4}
              className="bg-gray-50 rounded-lg"
              value={formValues.bio}
              onChange={(e) =>
                setFormValues({ ...formValues, bio: e.target.value })
              }
            />
          </Form.Item>
          <Form.Item 
            name="onCallAvailability" 
            label="On-Call Availability"
            rules={[
              { required: true, message: "Please input your on-call availability!" },
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Enter on-call availability"
              className="bg-gray-50 rounded-lg"
              value={formValues.onCallAvailability}
              onChange={(e) =>
                setFormValues({
                  ...formValues,
                  onCallAvailability: e.target.value,
                })
              }
            />
          </Form.Item>
        </Card>
      ),
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    console.log("Form values:", formValues);
    console.log('email ius',emailParam);
    
    const response = await axiosInstance.post('/doctor-service/doctorVerification', {formValues,email:emailParam});
    if(response){
      router.push('/login')
    }
    message.success("Form submitted successfully!");
  };

  return (
    <div
      className="container mx-auto p-0 bg-cover bg-center bg-no-repeat min-h-screen"
      style={{ backgroundImage: "url('https://source.unsplash.com/random')" }}
    >
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex w-full max-w-7xl bg-white shadow-lg rounded-lg">
          <div className="w-full md:w-1/2 p-6">
            <Title level={2} className="text-center mb-6">
              Doctor Verification Form 
            </Title>
            <Steps current={currentStep} className="mb-6">
              {steps.map((step, index) => (
                <Step key={index} title={step.title} />
              ))}
            </Steps>
            <Form layout="vertical">
              <div className="mb-6">{steps[currentStep].content}</div>
              <div className="flex justify-between">
                <Button
                  type="default"
                  onClick={handlePrev}
                  disabled={currentStep === 0}
                  className="bg-gray-400 text-white"
                >
                  Previous
                </Button>
                {currentStep === steps.length - 1 ? (
                  <Button
                    type="primary"
                    onClick={handleSubmit}
                    className="bg-blue-500 text-white"
                  >
                    Submit
                  </Button>
                ) : (
                  <Button
                    type="primary"
                    onClick={handleNext}
                    className="bg-blue-500 text-white"
                  >
                    Next
                  </Button>
                )}
              </div>
            </Form>
          </div>
          <div className="hidden md:w-1/2 md:block bg-blue-100 p-10 rounded-3xl">
            <Image
              src={verfication4}
              alt="Logo"
              width={500}
              height={500}
              className="flex mt-32 ml-14"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorSignupForm;