import { HashLoader } from 'react-spinners'

const Loader = ({
  fullScreen = true,
  size = 100,
  color = '#1e3a6e',
  overlayOpacity = 0.1,
  zIndex = 2000,
  blurAmount = '3px',
}) => {
  if (fullScreen) {
    return (
      <div
        className="fixed inset-0 flex flex-col items-center justify-center gap-3"
        style={{
          backgroundColor: `rgba(0, 0, 0, ${overlayOpacity})`,
          backdropFilter: `blur(${blurAmount})`,
          WebkitBackdropFilter: `blur(${blurAmount})`,
          zIndex: zIndex,
        }}
      >
        <HashLoader color={color} size={size} />
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <HashLoader color={color} size={size} />
    </div>
  )
}

export default Loader