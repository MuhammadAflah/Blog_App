
export const createMessage = async (req, res) => {
  try {
  } catch (error) {
    console.log(error.message);
    return res.status(500).json("Internal server error");
  }
};
