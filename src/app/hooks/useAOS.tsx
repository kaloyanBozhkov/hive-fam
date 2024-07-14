import AOS from "aos";
import { useEffect } from "react";

const useAOS = () => {
  // enable all data-aos animations
  useEffect(() => {
    AOS.init({ mirror: true });
  }, []);
};

export default useAOS;
