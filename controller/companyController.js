const Company = require("../model/company");
const path = require("path");
const fs = require("fs");
const isServerless = !!(
  process.env.VERCEL ||
  process.env.NOW ||
  process.env.IS_SERVERLESS
);
let firebaseStorage;
try {
  firebaseStorage = require("../utils/firebaseStorage");
} catch (e) {
  // helper may not exist yet in some environments
  firebaseStorage = null;
}
const Deal = require("../model/deal");

exports.createCompany = async (req, res) => {
  try {
    if (req.body.dealSummary) {
      req.body.dealSummary = JSON.parse(req.body.dealSummary);
    }
    if (req.body.news) {
      req.body.news = JSON.parse(req.body.news);
    }
    if (req.files) {
      // multer memory storage: files are in req.files[field][i].buffer
      if (req.files.cover && req.files.cover[0]) {
        if (firebaseStorage && req.files.cover[0].buffer) {
          const uploaded = await firebaseStorage.uploadBufferToFirebase(req.files.cover[0].buffer, req.files.cover[0].originalname, req.files.cover[0].mimetype);
          req.body.cover = uploaded.url;
        } else if (req.files.cover[0].url) {
          req.body.cover = req.files.cover[0].url;
        } else {
          return res.status(400).json({ message: 'Cover upload failed' });
        }
      }
      if (req.files.profile && req.files.profile[0]) {
        if (firebaseStorage && req.files.profile[0].buffer) {
          const uploaded = await firebaseStorage.uploadBufferToFirebase(req.files.profile[0].buffer, req.files.profile[0].originalname, req.files.profile[0].mimetype);
          req.body.profile = uploaded.url;
        } else if (req.files.profile[0].url) {
          req.body.profile = req.files.profile[0].url;
        } else {
          return res.status(400).json({ message: 'Profile upload failed' });
        }
      }

      if (!req.body.investDoc) {
        req.body.investDoc = [];
      }

      if (req.files.update && req.files.update.length > 0) {
        req.body.update = [];
        for (let i = 0; i < req.files.update.length; i++) {
          const f = req.files.update[i];
          if (firebaseStorage && f.buffer) {
            const uploaded = await firebaseStorage.uploadBufferToFirebase(f.buffer, f.originalname, f.mimetype);
            req.body.update.push({ ...f, updatedoc: uploaded.url, date: Date.now(), id: i });
          } else if (f.url) {
            req.body.update.push({ ...f, updatedoc: f.url, date: Date.now(), id: i });
          } else {
            return res.status(400).json({ message: 'One or more update files failed to upload' });
          }
        }
      }

      if (req.files.investDoc && req.files.investDoc.length > 0) {
        req.body.investDoc = [];
        for (let i = 0; i < req.files.investDoc.length; i++) {
          const f = req.files.investDoc[i];
          if (firebaseStorage && f.buffer) {
            const uploaded = await firebaseStorage.uploadBufferToFirebase(f.buffer, f.originalname, f.mimetype);
            req.body.investDoc.push({ ...f, updatedoc: uploaded.url, date: Date.now(), id: i });
          } else if (f.url) {
            req.body.investDoc.push({ ...f, updatedoc: f.url, date: Date.now(), id: i });
          } else {
            return res.status(400).json({ message: 'One or more investDoc files failed to upload' });
          }
        }
      }
    }

    const company = await Company.findById(req.body.creatorId);
    if (company) {
      return res.status(403).json({ message: "This Company already added " });
    }
    await new Company(req.body).save();
    res.status(201).json("company addedd successfully");
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ messsage: error?._message || "something went wrong!" });
  }
};

exports.updateCompany = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(403).json({ message: "Company Id invalid " });
    }
    if (req.body.dealSummary) {
      req.body.dealSummary = JSON.parse(req.body.dealSummary);
    }
    if (req.body.news) {
      req.body.news = JSON.parse(req.body.news || "");
    }
    console.log(req.files);
    if (req.files) {
      if (req.files.cover && req.files.cover[0]) {
        if (firebaseStorage && req.files.cover[0].buffer) {
          const uploaded = await firebaseStorage.uploadBufferToFirebase(req.files.cover[0].buffer, req.files.cover[0].originalname, req.files.cover[0].mimetype);
          req.body.cover = uploaded.url;
        } else if (req.files.cover[0].url) {
          req.body.cover = req.files.cover[0].url;
        } else {
          return res.status(400).json({ message: 'Cover upload failed' });
        }
      }
      if (req.files.profile && req.files.profile[0]) {
        if (firebaseStorage && req.files.profile[0].buffer) {
          const uploaded = await firebaseStorage.uploadBufferToFirebase(req.files.profile[0].buffer, req.files.profile[0].originalname, req.files.profile[0].mimetype);
          req.body.profile = uploaded.url;
        } else if (req.files.profile[0].url) {
          req.body.profile = req.files.profile[0].url;
        } else {
          return res.status(400).json({ message: 'Profile upload failed' });
        }
      }

      if (!req.body.investDoc) {
        req.body.investDoc = [];
      }

      if (req.files.update && req.files.update.length > 0) {
        req.body.update = [];
        for (let i = 0; i < req.files.update.length; i++) {
          const f = req.files.update[i];
          if (firebaseStorage && f.buffer) {
            const uploaded = await firebaseStorage.uploadBufferToFirebase(f.buffer, f.originalname, f.mimetype);
            req.body.update.push({ ...f, updatedoc: uploaded.url, date: Date.now(), id: i });
          } else if (f.url) {
            req.body.update.push({ ...f, updatedoc: f.url, date: Date.now(), id: i });
          } else {
            return res.status(400).json({ message: 'One or more update files failed to upload' });
          }
        }
      }

      if (req.files.investDoc && req.files.investDoc.length > 0) {
        req.body.investDoc = [];
        for (let i = 0; i < req.files.investDoc.length; i++) {
          const f = req.files.investDoc[i];
          if (firebaseStorage && f.buffer) {
            const uploaded = await firebaseStorage.uploadBufferToFirebase(f.buffer, f.originalname, f.mimetype);
            req.body.investDoc.push({ ...f, updatedoc: uploaded.url, date: Date.now(), id: i });
          } else if (f.url) {
            req.body.investDoc.push({ ...f, updatedoc: f.url, date: Date.now(), id: i });
          } else {
            return res.status(400).json({ message: 'One or more investDoc files failed to upload' });
          }
        }
      }
    }
    await Company.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json("Company update Successfully");
  } catch (error) {
    console.log(error);
    res.status(500).json({ messsage: "something went wrong!" });
  }
};

exports.updateWithoutFile = async (req, res) => {
  try {
    const { investDate, currentValuation } = req.body;
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(403).json({ message: "Company Id invalid " });
    }
    company.dealSummary.investDate = investDate;
    company.dealSummary.currentValuation = currentValuation;
    await company.save();
    res.status(200).json("Company update Successfully");
  } catch (error) {
    console.log(error);
    res.status(500).json({ messsage: "something went wrong!" });
  }
};

exports.deleteCompany = async (req, res) => {
  try {
    await Deal.deleteMany({ companyId: req?.params?.id });
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(403).json({ message: "Company Id invalid " });
    }
    await Company.findByIdAndDelete(req.params.id);
    res.status(200).json("Company delete Successfully");
  } catch (error) {
    console.log(error);
    res.status(500).json({ messsage: "something went wrong!" });
  }
};

exports.getByIdCompany = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(403).json({ message: "Company Id invalid" });
    }
    res.status(200).json(company);
  } catch (error) {
    console.log(error);
    res.status(500).json({ messsage: "something went wrong!" });
  }
};

exports.getAllCompany = async (req, res) => {
  try {
    const companies = await Company.find();
    res.status(200).json(companies);
  } catch (error) {
    console.log(error);
    res.status(500).json({ messsage: "something went wrong!" });
  }
};

exports.getAllByCreatorCompany = async (req, res) => {
  try {
    const compnies = await Company.find({ creator: req.params.creatorId });
    res.status(200).json(compnies);
  } catch (error) {
    console.log(error);
    res.status(500).json({ messsage: "something went wrong!" });
  }
};

// new controller

exports.addNews = async (req, res) => {
  try {
    const company = await Company.findById(req.params.companyId);
    if (!company) {
      return res.status(403).json({ message: "Company Id invalid" });
    }
    company.news.push(req.body);
    await company.save();
    res.status(200).json("News added successfully");
  } catch (error) {
    console.log(error);
    res.status(500).json({ messsage: "something went wrong!" });
  }
};
exports.deleteNews = async (req, res) => {
  try {
    const company = await Company.findById(req.params.companyId);
    if (!company) {
      return res.status(403).json({ message: "Company Id invalid" });
    }
    company.news = company.news.filter((v) => v._id !== req.params.id);
    await company.save();
    res.status(200).json("News added successfully");
  } catch (error) {
    console.log(error);
    res.status(500).json({ messsage: "something went wrong!" });
  }
};

exports.addUpdateDoc = async (req, res) => {
  try {
    const company = await Company.findById(req.params.companyId);
    if (!company) {
      return res.status(403).json({ message: "Company Id invalid" });
    }
    let updateDoc;
    if (req.files && req.files.doc) {
      const f = req.files.doc[0] || req.files[0];
      if (!f) return res.status(400).json({ message: 'Document upload failed' });
      if (firebaseStorage && f.buffer) {
        const uploaded = await firebaseStorage.uploadBufferToFirebase(f.buffer, f.originalname || f.filename, f.mimetype);
        updateDoc = uploaded.url;
      } else if (f.url) {
        updateDoc = f.url;
      } else {
        return res.status(400).json({ message: 'Document upload failed' });
      }
    }
    req.body.updateDoc = {
      updateDoc,
      date: new Date(),
    };
    company.update.push(req.body);
    await company.save();
    res.status(200).json("News added successfully");
  } catch (error) {
    console.log(error);
    res.status(500).json({ messsage: "something went wrong!" });
  }
};

exports.deleteUpdateDoc = async (req, res) => {
  try {
    const company = await Company.findById(req.params.companyId);
    if (!company) {
      return res.status(403).json({ message: "Invalid Company ID" });
    }

    const docIndex = company.update.findIndex(
      (doc) => doc._id === req.params.id
    );
    if (docIndex === -1) {
      return res
        .status(404)
        .json({ message: "Document not found in the updateDoc array" });
    }

    const documentToDelete = company.update[docIndex];

    if (documentToDelete.updateDoc) {
      const filePath = path.join(
        __dirname,
        "..",
        "public",
        documentToDelete.updateDoc
      );
      if (isServerless) {
        console.warn(
          "Running in serverless/read-only environment - skipping file deletion for",
          filePath
        );
      } else {
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error("Error deleting file:", err);
            return res
              .status(500)
              .json({ message: "Failed to delete the document file." });
          } else {
            console.log("File deleted:", filePath);
          }
        });
      }
    }

    company.update.splice(docIndex, 1);

    await company.save();

    res.status(200).json("Document deleted successfully");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong!" });
  }
};

exports.addInvestDoc = async (req, res) => {
  try {
    const company = await Company.findById(req.params.companyId);
    if (!company) {
      return res.status(403).json({ message: "Company Id invalid" });
    }
    let investDoc;
    if (req.files && req.files.investDoc) {
      const f = req.files.investDoc[0];
      if (!f) return res.status(400).json({ message: 'Invest document upload failed' });
      if (firebaseStorage && f.buffer) {
        const uploaded = await firebaseStorage.uploadBufferToFirebase(f.buffer, f.originalname || f.filename, f.mimetype);
        investDoc = uploaded.url;
      } else if (f.url) {
        investDoc = f.url;
      } else {
        return res.status(400).json({ message: 'Invest document upload failed' });
      }
    }
    req.body.investDoc = {
      investDoc,
      date: new Date(),
    };
    company.investDoc.push(req.body);
    await company.save();
    res.status(200).json("News added successfully");
  } catch (error) {
    console.log(error);
    res.status(500).json({ messsage: "something went wrong!" });
  }
};

exports.deleteInvestDoc = async (req, res) => {
  try {
    const company = await Company.findById(req.params.companyId);
    if (!company) {
      return res.status(403).json({ message: "Invalid Company ID" });
    }

    const docIndex = company.investDoc.findIndex(
      (doc) => doc._id === req.params.id
    );
    if (docIndex === -1) {
      return res
        .status(404)
        .json({ message: "Document not found in the updateDoc array" });
    }

    const documentToDelete = company.investDoc[docIndex];

    if (documentToDelete.investDoc) {
      const filePath = path.join(
        __dirname,
        "..",
        "public",
        documentToDelete.investDoc
      );
      if (isServerless) {
        console.warn(
          "Running in serverless/read-only environment - skipping file deletion for",
          filePath
        );
      } else {
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error("Error deleting file:", err);
            return res
              .status(500)
              .json({ message: "Failed to delete the document file." });
          } else {
            console.log("File deleted:", filePath);
          }
        });
      }
    }

    company.investDoc.splice(docIndex, 1);

    await company.save();

    res.status(200).json("Document deleted successfully");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong!" });
  }
};
exports.downloadFile = async (req, res) => {
  try {
    const fileName = req.params.fileName;
    const fileDirectory = path.join(__dirname, "../public/company");
    const filePath = path.join(fileDirectory, fileName);
    if (fs.existsSync(filePath)) {
      res.download(filePath, (err) => {
        if (err) {
          return res.status(404).send({ message: "File not found!" });
        }
      });
    } else {
      return res.status(404).send({ message: "File not found!" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong!" });
  }
};
