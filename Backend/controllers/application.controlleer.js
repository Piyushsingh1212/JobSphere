import Application from "../models/application.model.js";
import {Job} from "../models/job.model.js";

/* ================= APPLY JOB ================= */
export const applyJob = async (req, res) => {
  try {
    const userId = req.id;
    const jobId = req.params.id;

    if (!jobId) {
      return res.status(400).json({
        message: "Job id is required",
        success: false
      });
    }

    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: userId
    });

    if (existingApplication) {
      return res.status(400).json({
        message: "You already applied for this job",
        success: false
      });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        message: "Job not found",
        success: false
      });
    }

    const newApplication = await Application.create({
      job: jobId,
      applicant: userId
    });

    job.applications.push(newApplication._id);
    await job.save();

    return res.status(200).json({
      message: "Job applied successfully",
      success: true
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message,
      success: false
    });
  }
};

/* ================= GET APPLIED JOBS ================= */
export const getAppliedJobs = async (req, res) => {
  try {
    const userId = req.id;

    const applications = await Application.find({ applicant: userId })
      .sort({ createdAt: -1 })
      .populate({
        path: "job",
        populate: {
          path: "company"
        }
      });

    if (!applications.length) {
      return res.status(404).json({
        message: "No applications found",
        success: false
      });
    }

    return res.status(200).json({
      success: true,
      applications
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message,
      success: false
    });
  }
};

/* ================= GET APPLICANTS ================= */
export const getApplicants = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await Job.findById(id).populate({
      path: "applications",
      options: { sort: { createdAt: -1 } },
      populate: {
        path: "applicant"
      }
    });

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
        success: false
      });
    }

    return res.status(200).json({
      success: true,
      applicants: job.applications
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message,
      success: false
    });
  }
};

/* ================= UPDATE APPLICATION STATUS ================= */
export const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const applicationId = req.params.id;

    if (!status) {
      return res.status(400).json({
        message: "Status is required",
        success: false
      });
    }

    const application = await Application.findById(applicationId);
    if (!application) {
      return res.status(404).json({
        message: "Application not found",
        success: false
      });
    }

    application.status = status.toLowerCase();
    await application.save();

    return res.status(200).json({
      message: "Status updated successfully",
      success: true
    });

  } catch (error) {
    console.error(error);
    res.status(5400).json({
      message: error.message,
      success: false
    });
  }
};
