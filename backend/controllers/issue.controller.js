import Issue from "../models/issue.model.js";

export const createIssue = async (req, res) => {
  const { title, description } = req.body;
  const id = req.params.id;
  try {
    const issue = new Issue({
      title,
      description,
      repository: id,
    });
    await issue.save();

    res.status(201).json({
      success: true,
      message: "created an issue",
      issue,
    });
  } catch (err) {
    console.error("error while createing an issue", err);
    res.status(500).json({
      success: false,
      message: "internal server error",
    });
  }
};

export const getAllIssues = async (req, res) => {
  const id = req.params.id;
  try {
    const issues = await Issue.find({ repository: id });
    if (!issues || issues.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Issue not found",
      });
    }
    res.status(200).json({
      success: true,
      issues,
    });
  } catch (error) {}
};
export const getIssueById = async (req, res) => {
  const id = req.params.id;
  try {
    const issue = await Issue.findById(id);
    if (!issue) {
      return res.status(404).json({
        success: false,
        message: "issue not found!",
      });
    }

    res.status(200).json({
      issue,
      success: true,
    });
  } catch (error) {
    console.error("Error during fetching the issue", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
export const updateIssueById = async (req, res) => {
  const id = req.params.id;
  const { title, description, status } = req.body;
  try {
    const issue = await Issue.findById(id);
    if (!issue) {
      return res.status(404).json({
        success: false,
        message: "issue not found!",
      });
    }
    issue.title = title;
    issue.description = description;
    issue.status = status;

    await issue.save();
    res.json(issue);
  } catch (error) {
    console.error("Error during updatin the issue", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
export const deleteIssueById = async (req, res) => {
  const id = req.params.id;
  try {
    const issue = await Issue.findByIdAndDelete(id);

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: "Issue not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Issue deleted successfully",
    });
  } catch (error) {
    console.error("Error during deletion of issue", error);
    res.status(500).json({
      success: false,
      message: "Intenal server error",
    });
  }
};
