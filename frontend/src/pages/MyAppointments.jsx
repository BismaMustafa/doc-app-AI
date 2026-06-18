import React, { useContext } from 'react'
import {AppContext} from '../context/AppContext'
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useEffect } from 'react';
import { loadStripe } from "@stripe/stripe-js";
import { CardElement, Elements, useElements, useStripe } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
);

// Payment form component
const PaymentForm = ({ appointmentId, amount, backendUrl, token, onSuccess, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async (e) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      // Create payment intent
      const { data } = await axios.post(
        backendUrl + "/api/user/payment-appointment",
        { appointmentId, amount },
        { headers: { token } }
      );

      if (!data.success) {
        toast.error("Failed to create payment");
        setIsProcessing(false);
        return;
      }

      // Confirm payment
      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (result.error) {
        toast.error(result.error.message);
        setIsProcessing(false);
      } else if (result.paymentIntent.status === "succeeded") {
        // Verify payment in backend
        const verifyRes = await axios.post(
          backendUrl + "/api/user/verify-payment",
          { 
            appointmentId, 
            paymentId: result.paymentIntent.id 
          },
          { headers: { token } }
        );

        if (verifyRes.data.success) {
          toast.success("Payment successful!");
          onSuccess();
        } else {
          toast.error("Payment verification failed");
        }
        setIsProcessing(false);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
      setIsProcessing(false);
    }
  };

  return (
    <div className='bg-white rounded-lg shadow-lg p-6 max-w-md'>
      <h3 className='text-xl font-bold text-gray-800 mb-4'>💳 Payment Details</h3>
      
      <div className='bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 mb-6'>
        <p className='text-sm text-gray-600 mb-1'>Amount to Pay</p>
        <p className='text-3xl font-bold text-blue-600'>${amount}</p>
      </div>

      <form onSubmit={handlePayment}>
        <div className='mb-6'>
          <label className='text-sm font-semibold text-gray-700 block mb-3'>Card Information</label>
          <div className='border-2 border-gray-300 rounded-lg p-4 bg-white focus-within:border-blue-500 focus-within:shadow-md transition-all'>
            <CardElement 
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#1f2937',
                    fontFamily: 'Segoe UI, system-ui, sans-serif',
                    '::placeholder': {
                      color: '#9ca3af',
                    },
                  },
                  invalid: {
                    color: '#ef4444',
                  },
                },
              }}
            />
          </div>
        </div>

        <div className='flex gap-3'>
          <button
            type="submit"
            disabled={isProcessing || !stripe}
            className='flex-1 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-all duration-300 flex items-center justify-center gap-2'
          >
            {isProcessing ? (
              <>
                <svg className='animate-spin h-5 w-5' viewBox='0 0 24 24'>
                  <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' fill='none'></circle>
                  <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                </svg>
                Processing...
              </>
            ) : (
              <>
                <span>✓</span> Pay Now
              </>
            )}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className='flex-1 py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-all duration-300'
          >
            Cancel
          </button>
        </div>

        <p className='text-xs text-gray-500 text-center mt-4'>
          🔒 Your payment information is secure and encrypted
        </p>
      </form>
    </div>
  );
};

function MyAppointments() {
  const {backendUrl,token,getDoctorsData} = useContext(AppContext);
  const [appointments,setAppointments] = useState([])
  const [paymentAppointmentId, setPaymentAppointmentId] = useState(null);

  const months = [
    "","Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  const slotDateFormat =  (slotDate) =>{
    const dateArray = slotDate.split('_')
    return dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2]
  }

  const getUserAppointments = async () =>{
    try {
      const {data} = await axios.get(backendUrl + '/api/user/appointments',{headers:{token}})
      if(data.success){
        setAppointments(data.appointments.reverse())
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const cancelAppointment = async (appointmentId) =>{
    try {
      const {data} = await axios.post(backendUrl + '/api/user/cancel-appointment',{appointmentId},{headers:{token}})
      if(data.success){
        toast.success(data.message)
        getUserAppointments()
        getDoctorsData()
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  useEffect(()=>{
    if(token){
      getUserAppointments()
    }
  },[token])

  return (
    <div className='max-w-4xl mx-auto'>
      <p className='pb-3 mt-12 font-medium text-zinc-700 border-b border-gray-200'>My Appointments</p>
      <div>
        {appointments.map((item,index) => (
          <div key={index}>
            <div className="grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b border-gray-200">
              <div>
                <img className='w-32 bg-indigo-50' src={item.docData.image} alt="" />
              </div>
              <div className='flex-1 text-sm text-zinc-600'>
                <p className='text-neutral-800 font-semibold'>{item.docData.name}</p>
                <p>{item.docData.speciality}</p>
                <p className='text-zinc-700 font-medium mt-1'>Address:</p>
                <p className='text-xs'>{item.docData.address.line1}</p>
                <p className='text-xs'>{item.docData.address.line2}</p>
                <p className='text-xs mt-1'><span className='text-sm text-neutral-700 font-medium'>Date & Time:</span> {slotDateFormat(item.slotDate)} | {item.slotTime}</p>
                <p className='text-sm mt-2'><span className='font-semibold'>Amount: </span>${item.amount}</p>
              </div>
              <div className='flex flex-col gap-2 justify-end'>
                {item.payment === false && item.cancelled === false && item.isCompleted === false && (
                  <button 
                    onClick={() => setPaymentAppointmentId(item._id)}
                    className='text-sm text-white text-center sm:min-w-48 py-2 bg-blue-500 border border-blue-500 rounded cursor-pointer hover:bg-blue-600 transition-all duration-300'
                  >
                    Pay Online
                  </button>
                )}
                {item.payment === true && item.cancelled === false && item.isCompleted === false && (
                  <div className='text-sm text-green-600 text-center sm:min-w-48 py-2 border border-green-500 rounded'>
                    ✓ Payment Done
                  </div>
                )}
                {item.cancelled === false && item.isCompleted === false && (
                  <button 
                    onClick={()=>cancelAppointment(item._id)} 
                    className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border border-gray-300 rounded cursor-pointer hover:bg-red-600 hover:text-white transition-all duration-300'
                  >
                    Cancel appointment
                  </button>
                )}
                {item.cancelled === true && item.isCompleted === false && (
                  <button className='sm:min-w-48 py-2 border border-red-500 rounded text-red-500 cursor-pointer'>
                    Appointment Cancelled
                  </button>
                )}
                {item.isCompleted === true && (
                  <button className='sm:min-w-48 py-2 border border-green-500 rounded text-green-500'>
                    Completed
                  </button>
                )}
              </div>
            </div>

            {/* Payment Form */}
            {paymentAppointmentId === item._id && (
              <div className='mt-6 mb-6 flex justify-center'>
                <div className='w-full max-w-md'>
                  <Elements stripe={stripePromise}>
                    <PaymentForm
                      appointmentId={item._id}
                      amount={item.amount}
                      backendUrl={backendUrl}
                      token={token}
                      onSuccess={() => {
                        setPaymentAppointmentId(null);
                        getUserAppointments();
                      }}
                      onCancel={() => setPaymentAppointmentId(null)}
                    />
                  </Elements>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default MyAppointments
