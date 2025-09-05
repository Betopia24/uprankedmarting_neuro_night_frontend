"use client";

import React, { useState } from "react";
import { FaCcVisa, FaCcMastercard, FaCcAmex } from "react-icons/fa6";
import { IoArrowBack, IoInformationCircle } from "react-icons/io5";

// Type definitions
type CardType = "visa" | "mastercard" | "amex" | "none";

interface FormData {
  cardNumber: string;
  expiryDate: string;
  cvc: string;
  cardholderName: string;
  agentCount: number;
}

interface Subscription {
  only_ai: boolean;
  planPrice: number;
  planId: string;
  organizationId: string;
  sid: string;
  planLevel: string;
  number: string;
}

const Subscription: React.FC<Subscription> = ({
  only_ai,
  planPrice,
  planId,
  organizationId,
  sid,
  planLevel,
  number,
}) => {
  const [cardType, setCardType] = useState<CardType>("none");
  const [formData, setFormData] = useState<FormData>({
    cardNumber: "",
    expiryDate: "",
    cvc: "",
    cardholderName: "",
    agentCount: only_ai ? 0 : 1,
  });

  const subTotal = (planPrice * formData.agentCount).toFixed(2);

  const checkoutData = {};

  const handleCardNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const number = e.target.value.replace(/\s/g, "");

    if (/^4/.test(number)) {
      setCardType("visa");
    } else if (/^5[1-5]/.test(number)) {
      setCardType("mastercard");
    } else if (/^3[47]/.test(number)) {
      setCardType("amex");
    } else {
      setCardType("none");
    }

    setFormData((prev: FormData) => ({
      ...prev,
      cardNumber: e.target.value,
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;

    setFormData((prev: FormData) => ({
      ...prev,
      [name]: name === "agentCount" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    console.log("Form Data:", formData);
    const readyData = {
      subscription: {
        planId,
        organizationId,
        sid,
        planLevel,
        purchasedNumber: number.toString().trim(),
        numberOfAgents: formData.agentCount,
      },
      cardDetails: {
        cardNumber: formData.cardNumber,
        expiryDate: formData.expiryDate,
        cvc: formData.cvc,
        cardholderName: formData.cardholderName,
      },
    };
    console.log("Ready Data:", readyData);
    // Handle form submission here
  };

  const handleBackClick = (): void => {
    // Handle back navigation
    console.log("Back button clicked");
  };

  return (
    <div className="bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full lg:grid lg:grid-cols-2 shadow-2xl rounded-2xl overflow-hidden">
        {/* Left Side: Summary Panel */}
        <div className="bg-blue-600 text-white p-8 md:p-12">
          <button
            onClick={handleBackClick}
            className="flex items-center space-x-2 opacity-80 hover:opacity-100 transition-opacity mb-10"
            type="button"
          >
            <IoArrowBack className="h-6 w-6" />
            <span className="font-semibold">TempleRun</span>
          </button>

          <div className="mb-10">
            <p className="text-base text-blue-200">Subscription fee</p>
            <div className="flex items-baseline mt-2">
              <span className="text-5xl font-bold">
                ${planPrice.toFixed(2)}
              </span>
              <span className="text-xl font-medium text-blue-200 ml-2">
                Per month
              </span>
            </div>
          </div>

          <div className="space-y-4 text-sm mb-8">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold text-base">Platform basic</p>
                <p className="text-blue-200">Billed monthly</p>
              </div>
              <p className="font-semibold text-base">${subTotal}</p>
            </div>
          </div>

          <hr className="border-blue-500 my-8" />

          <div className="space-y-4 text-sm font-medium">
            <div className="flex justify-between items-center text-blue-200">
              <p>Subtotal</p>
              <p> ${subTotal}</p>
            </div>
            <div className="flex justify-between items-center text-blue-200">
              <p>Tax</p>
              <p>$0.00</p>
            </div>
            <div className="flex justify-between items-center text-white text-lg font-bold mt-4">
              <p>Total due today</p>
              <p> ${subTotal}</p>
            </div>
          </div>
        </div>

        {/* Right Side: Payment Form */}
        <div className="bg-white p-8 md:p-12">
          {/* Agent Selection - Positioned at the top */}
          {!only_ai && (
            <div className="mb-8">
              <label
                htmlFor="agent-count"
                className="block text-lg font-semibold text-gray-700 mb-2"
              >
                Number of Agents
              </label>
              <input
                type="number"
                id="agent-count"
                name="agentCount"
                min={1}
                max={100}
                value={formData.agentCount}
                onChange={handleInputChange}
                className="block w-full border-gray-300 rounded-lg shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter number of agents"
              />
              <p className="text-gray-500 text-xs mt-1">
                Select the number of agents for your subscription
              </p>
            </div>
          )}

          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Payment method
            </h3>
            <div className="border-b">
              <button
                type="button"
                className="text-blue-600 font-semibold py-2 px-1 border-b-2 border-blue-600 -mb-px"
              >
                Credit or Debit Card
              </button>
            </div>
            <p className="text-red-500 text-xs mt-1">Please Select Card*</p>
          </div>

          <div>
            <div className="space-y-6">
              {/* Card Information */}
              <div>
                <label
                  htmlFor="card-number"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Card information
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="card-number"
                    name="cardNumber"
                    placeholder="0000 0000 0000 0000"
                    className="block w-full border-gray-300 rounded-lg shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500 pr-32"
                    value={formData.cardNumber}
                    onChange={handleCardNumberChange}
                    autoComplete="cc-number"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center space-x-2">
                    <FaCcVisa
                      className={`text-xl text-blue-800 transition-opacity duration-300 ${
                        cardType === "visa" || cardType === "none"
                          ? "opacity-100"
                          : "opacity-30"
                      }`}
                    />
                    <FaCcMastercard
                      className={`text-xl text-red-600 transition-opacity duration-300 ${
                        cardType === "mastercard" || cardType === "none"
                          ? "opacity-100"
                          : "opacity-30"
                      }`}
                    />
                    <FaCcAmex
                      className={`text-xl text-blue-600 transition-opacity duration-300 ${
                        cardType === "amex" || cardType === "none"
                          ? "opacity-100"
                          : "opacity-30"
                      }`}
                    />
                  </div>
                </div>
                <p className="text-red-500 text-xs mt-1">
                  Please enter valid card information*
                </p>
              </div>

              {/* Expiry and CVC */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="expiry-date"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    MM / YY
                  </label>
                  <input
                    type="text"
                    id="expiry-date"
                    name="expiryDate"
                    placeholder="MM / YY"
                    className="block w-full border-gray-300 rounded-lg shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.expiryDate}
                    onChange={handleInputChange}
                    autoComplete="cc-exp"
                    maxLength={7}
                  />
                  <p className="text-red-500 text-xs mt-1">
                    Please enter a valid date*
                  </p>
                </div>
                <div>
                  <label
                    htmlFor="cvc"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    CVC
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="cvc"
                      name="cvc"
                      placeholder="123"
                      className="block w-full border-gray-300 rounded-lg shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"
                      value={formData.cvc}
                      onChange={handleInputChange}
                      autoComplete="cc-csc"
                      maxLength={4}
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <IoInformationCircle className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                  <p className="text-red-500 text-xs mt-1">
                    Please enter the CVC*
                  </p>
                </div>
              </div>

              {/* Cardholder Name */}
              <div>
                <label
                  htmlFor="cardholder-name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Cardholder name
                </label>
                <input
                  type="text"
                  id="cardholder-name"
                  name="cardholderName"
                  placeholder="John Doe"
                  className="block w-full border-gray-300 rounded-lg shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.cardholderName}
                  onChange={handleInputChange}
                  autoComplete="cc-name"
                />
                <p className="text-red-500 text-xs mt-1">
                  Please enter the cardholder's name*
                </p>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 transform hover:scale-105"
                >
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subscription;
