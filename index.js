const { launchCustomBrowser } = require("./src/browsers/launchBrowser");
const { getConfig } = require("./src/utils/helpers");
const { width, height } = require("screenz");

(async () => {
  const config = getConfig();
  const profileKeys = Object.keys(config.profiles);

  const screenWidth = width; // Available screen width
  const screenHeight = height; // Available screen height
  const numProfiles = profileKeys.length; 
  const cols = Math.floor(
    screenWidth / (screenWidth / Math.ceil(Math.sqrt(numProfiles)))
  );
  const windowWidth = Math.floor(screenWidth / cols); 
  const windowHeight = Math.floor(
    (screenHeight - 20) / Math.ceil(numProfiles / cols)
  ); 

  const windowGap = 10; 
  let xPosition = 0;
  let yPosition = 0;

  const launchPromises = []; // Collect all launch promises

  for (let i = 0; i < numProfiles; i++) {
    const profileKey = profileKeys[i];

    // Set window position and dimensions
    if (yPosition + windowHeight <= screenHeight) {
      launchPromises.push(
        launchCustomBrowser(
          profileKey,
          xPosition,
          yPosition,
          windowWidth,
          windowHeight,
          'https://app.nodepay.ai/dashboard'
        )
      );

      // Update xPosition for the next profile window
      xPosition += windowWidth + windowGap; 
      if ((i + 1) % cols === 0) {
        xPosition = 0;
        yPosition += windowHeight + windowGap; 
      }
    } else {
      console.log(
        `Không thể mở profile "${profileKey}" vì không đủ không gian trên màn hình.`
      );
      break;
    }
  }

  // Đợi tất cả các cửa sổ trình duyệt được mở
  await Promise.all(launchPromises);
})();
