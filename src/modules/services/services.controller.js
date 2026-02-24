const servicesService = require("./services.service");

exports.createService = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admin can create service" });
    }

    const { title, description, location, last_date, max_applicants } = req.body;

    if (!title || !location) {
      return res.status(400).json({ message: "Title and location required" });
    }

    const newService = await servicesService.createService({
      title,
      description,
      location,
      last_date,
      max_applicants,
      organization_id: req.user.organization_id,
      created_by: req.user.id
    });

    res.status(201).json({
      success: true,
      data: newService
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// exports.getServices = async (req, res) => {
//   try {
//     const services = await servicesService.getAllServices();
//     res.json({
//       success: true,
//       data: services
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// };
exports.getServices = async (req, res) => {
  try {
    const services = await servicesService.getAllServices(req.query);

    res.json({
      success: true,
      page: req.query.page || 1,
      data: services
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
exports.applyService = async (req, res) => {
  try {
    const serviceId = req.params.id;

    const application = await servicesService.applyToService(
      req.user.id,
      serviceId
    );

    res.status(201).json({
      success: true,
      data: application
    });

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};