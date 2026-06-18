import React from "react";
import { useContext } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { useEffect } from "react";
import { assets } from "../../assets/assets";
import { AppContext } from "../../context/AppContext";
import VoiceSymptomChecker from "../../components/VoiceSymptomChecker";

function DoctorDashboard() {
  const {
    dToken,
    dashData,
    setDashData,
    getDashData,
    completeAppointment,
    cancelAppointment,
  } = useContext(DoctorContext);
  console.log("DASHDATA:", dashData)
  const { currency, slotDateFormat } = useContext(AppContext);
  useEffect(() => {
    if (dToken) {
      getDashData();
    }
  }, [dToken]);
  return (
    dashData && (
      <div className="m-5">
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
            <img className="w-14 " src={assets.earning_icon} alt="" />
            <div>
              <p className="text-xl font-semibold text-gray-600">
                {currency}
                {dashData.earnings}{" "}
              </p>
              <p className="text-gray-400 ">Earnings </p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
            <img className="w-14 " src={assets.appointments_icon} alt="" />
            <div>
              <p className="text-xl font-semibold text-gray-600">
                {dashData.appointments}{" "}
              </p>
              <p className="text-gray-400 ">Appointments</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
            <img className="w-14 " src={assets.patients_icon} alt="" />
            <div>
              <p className="text-xl font-semibold text-gray-600">
                {dashData.patients}{" "}
              </p>
              <p className="text-gray-400 ">Patients </p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
            <img className="w-14 " src={assets.appointments_icon} alt="" />
            <div>
              <p className="text-xl font-semibold text-gray-600">
                {dashData.paidAppointments}{" "}
              </p>
              <p className="text-gray-400 ">Paid</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
            <img className="w-14 " src={assets.appointments_icon} alt="" />
            <div>
              <p className="text-xl font-semibold text-gray-600">
                {dashData.unpaidAppointments}{" "}
              </p>
              <p className="text-gray-400 ">Unpaid</p>
            </div>
          </div>
        </div>
        <div className="bg-white mt-7 ">
          <div className="flex items-center gap-2.5 px-4 py-4 rounded-t border border-gray-100 ">
            <img src={assets.list_icon} alt="" />
            <p className="font-semibold">Latest Bookings</p>
          </div>
          <div className="pt-4 border border-t-0 border-gray-100">
            {dashData.latestAppointments.map((item, index) => (
              <div
                className="flex items-center px-6 py-3 gap-3 hover:bg-gray-100"
                key={index}
              >
                <img
                  className="rounded-full w-10"
                  src={item.userData.image}
                  alt=""
                />
                <div className="flex-1 tex-sm">
                  <p className="text-gray-800 font-medium">
                    {item.userData.name}{" "}
                  </p>
                  <p className="text-gray-600">
                    {slotDateFormat(item.slotDate)}{" "}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <p className={`text-xs inline px-2 rounded-full ${item.payment ? 'border border-green-500 text-green-600 bg-green-50' : 'border border-red-500 text-red-600 bg-red-50'}`}>
                    {item.payment ? 'Paid' : 'Unpaid'}
                  </p>
                  {item.cancelled ? (
                    <p className="text-red-400 text-xs font-medium">Cancelled</p>
                  ) : item.isCompleted ? (
                    <p className="text-green-500 text-xs font-medium">Completed</p>
                  ) : (
                    <div className="flex">
                      <img
                        onClick={() => cancelAppointment(item._id)}
                        className="w-10 cursor-pointer"
                        src={assets.cancel_icon}
                        alt=""
                      />

                      <img
                        onClick={() => completeAppointment(item._id)}
                        className="w-10 cursor-pointer"
                        src={assets.tick_icon}
                        alt=""
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
       <div className="mt-10 p-6 border rounded bg-white shadow flex flex-col gap-4">
  <h2 className="text-xl font-semibold">AI Voice Symptom Checker</h2>

  {dashData.latestAppointments.length > 0 ? (
    <VoiceSymptomChecker
      doctorId={dashData.latestAppointments[0].docId}
      appointmentId={dashData.latestAppointments[0]._id}
    />
  ) : (
    <p className="text-gray-500">No appointments found.</p>
  )}
</div>


      </div>
    )
  );
}

export default DoctorDashboard;
