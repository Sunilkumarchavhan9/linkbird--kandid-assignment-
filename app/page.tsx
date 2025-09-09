import Image from "next/image";
import Navbar from "./src/components/navbar";
import HeroSec from "./src/components/heroSec";

export default function Home() {
  return (
    <div>
      <Navbar/>
      <HeroSec/>
    </div>
  );
}
