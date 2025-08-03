import animationData from "../../assets/approved.json";
import Lottie from "react-lottie";

function ApprovedAnimation() {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  return (
    <div className="scale-60 lg:scale-100 w-full">
      <Lottie
        style={{
          height: "100%",
          marginInline: "auto",
          width: "100%",
          maxWidth: "200px",
        }}
        options={defaultOptions}
        height={200}
        width={200}
      />
    </div>
  );
}

export default ApprovedAnimation;
