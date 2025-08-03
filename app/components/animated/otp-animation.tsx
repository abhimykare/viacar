import animationData from "../../assets/otp.json";
import Lottie from "react-lottie";

function OtpAnimation() {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  return (
    <div className="scale-40 lg:scale-100 w-full">
      <Lottie
        style={{
          height: "220px",
          width: "100%",
          maxWidth: "300px",
          marginBottom: "18px",
        }}
        options={defaultOptions}
        height={400}
        width={400}
      />
    </div>
  );
}

export default OtpAnimation;
