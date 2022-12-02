
const healthTestController = async (req, res) => {
    yekolaLogger.info("Health Check Route");

    res.status(200).json("Welcome! This Route is working");
}

export default healthTestController;