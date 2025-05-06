interface StepCardProps {
  number: number;
  title: string;
  description: string;
  image?: string;
  video?: string;
}

const StepCard = ({ number, title, description, image, video }: StepCardProps) => {
  return (
    <div className="flex flex-col lg:flex-row items-center gap-8 mb-12 fade-in visible">
      <div className="flex-1 order-2 lg:order-1">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 rounded-full bg-kitchance-teal flex items-center justify-center text-white font-bold text-xl">
            {number}
          </div>
          <h3 className="text-2xl font-semibold ml-4">{title}</h3>
        </div>
        <p className="text-gray-600 text-lg leading-relaxed">{description}</p>
      </div>

      <div className="flex-1 order-1 lg:order-2">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-tr from-kitchance-blue/20 to-kitchance-teal/20 rounded-2xl transform -rotate-3"></div>

          {video ? (
            <video
              src={video}
              autoPlay
              loop
              muted
              playsInline
              className="rounded-2xl shadow-md relative z-10 object-cover w-full h-[300px]"
            />
          ) : (
            <img
              src={image}
              alt={title}
              className="rounded-2xl shadow-md relative z-10 object-cover w-full h-[300px]"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default StepCard;
