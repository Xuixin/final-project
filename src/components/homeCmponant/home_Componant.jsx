import Image from "next/image";

//UI import
import { Button } from "@/components/ui/button";
import { CircleArrowRight } from "lucide-react";

export const Hero = () => {
  return (
    <section className="hear min-h-96 bg-white">
      <div className="bg-black px-4 grid h-full gap-10 rounded-lg ">
        <div className="w-full ">
          <h1 className="text-4xl font-semibold">
            Welcome to Our <span className="text-primary">Restaurant</span>
          </h1>
          <p className="my-4 text-gray-400">
            Discover our specialties, delicious dishes, and unparalleled
            service.
          </p>
        </div>
        <div className="space-x-5">
          <Button className="rounded-full gap-2 uppercase text-white px-4 py-2 text-sm">
            Order now
            <CircleArrowRight />
          </Button>
        </div>
      </div>
      <div className="hidden md:block lg:block relative rounded-lg border-e border-y border-muted">
        <Image
          src={"/tomyum.png"}
          objectFit={"contain"}
          alt={"tomyam"}
          className="object-cover h-full w-full absolute top-0 left-0 scale-125"
          layout="fill"
          placeholder="blur"
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQMAAAAl21bKAAAABlBMVEUAAAAnp8AAAAAXRSTlMAQObYZgAAAApJREFUeNpjYGBgAAAA"
        ></Image>
      </div>
    </section>
  );
};
