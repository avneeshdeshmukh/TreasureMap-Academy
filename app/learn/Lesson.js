import Image from "next/image";

export const Lesson = ({
    id,
    index,
    totalCount,
    locked,
    current,
    percentage,
  }) => {
    const cycleLength = 8;
    const cycleIndex = index % cycleLength;
  
    let indentationLevel;
  
    if (cycleIndex <= 2) indentationLevel = cycleIndex;
    else if (cycleIndex <= 4) indentationLevel = 4 - cycleIndex;
    else if (cycleIndex <= 6) indentationLevel = 4 - cycleIndex;
    else indentationLevel = cycleIndex - 8;
  
    const rightPosition = indentationLevel * 80;

    return(
        <div className=""
            style={{
                right : `${rightPosition}px`
        }}
        >
            <Image src={"/images/star.png"} width={50} height={50} 
            />
        </div>
    )
};