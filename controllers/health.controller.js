
const healthTestController = async (req, res) => {
    langoLogger.info("Health Check Route");

    res.status(200).json("Welcome! This Route is working");
}

export default healthTestController;