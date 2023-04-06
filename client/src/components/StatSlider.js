import {
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  SliderMark,
  Tooltip,
  FormLabel,
} from "@chakra-ui/react"
const StatSlider = ({onChange,onMouseEnter,onMouseLeave,loading,isOpen,tooltipLabel,formLabel,colorScheme})=>{
  return(
    <>
      <FormLabel textAlign="center">{formLabel}</FormLabel>
      <Slider
        id="slider"
        defaultValue={50}
        min={1}
        max={100}
        colorScheme={colorScheme}
        onChange={onChange}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        isDisabled={loading ? true : false}
      >
        <SliderMark value={25} mt="1" ml="-2.5" fontSize="sm">
          25
        </SliderMark>
        <SliderMark value={50} mt="1" ml="-2.5" fontSize="sm">
          50
        </SliderMark>
        <SliderMark value={75} mt="1" ml="-2.5" fontSize="sm">
          75
        </SliderMark>
        <SliderTrack>
          <SliderFilledTrack />
        </SliderTrack>
        <Tooltip
          hasArrow
          bg="teal.500"
          color="white"
          placement="top"
          isOpen={isOpen}
          label={tooltipLabel}
        >
          <SliderThumb />
        </Tooltip>
      </Slider>
    </>
  )
}
export default StatSlider