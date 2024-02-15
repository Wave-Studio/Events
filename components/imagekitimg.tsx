import { getURL } from "@/utils/imagekit/URL.ts";

const ImagekitImage = ({
  alt,
  path,
  sizes,
  className,
}: {
  path: string;
  sizes: number[];
  alt: string;
  className?: string;
}) => (
  <picture>
    {sizes.map((size) => {
      const [png, webp] = getURL(size, path);
      return (
        <>
          <source
            srcset={png}
            type="image/png"
            media={`(max-width: ${size}px)`}
          />
          <source
            srcset={webp}
            type="image/webp"
            media={`(max-width: ${size}px)`}
          />
        </>
      );
    })}
    <img src={getURL(480, path)[0]} alt={alt} class={className} />
  </picture>
);

export default ImagekitImage;
