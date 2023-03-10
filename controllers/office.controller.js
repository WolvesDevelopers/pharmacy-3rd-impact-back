"use strict";
const db = require("../db/db");
const MOffice = db.offices;
const { Op } = require("sequelize");
const responses = require("../middlewares/responses");

//get all offices
async function getAllOffices(req, res) {
  try {
    const offices = await MOffice.findAll({
      where: { status: true },
      order: [["SID", "asc"]],
    });
    responses.makeResponsesOkData(res, offices, "Success");
  } catch (e) {
    responses.makeResponsesException(res, e);
  }
}

//Find office by id
async function getOfficeByID(req, res) {
  try {
    const sid = req.params.id;
    let office = null;
    if (isNaN(sid)) {
      office = await MOffice.findOne({
        where: {
          code: sid,
          status: true,
        },
      });
    } else {
      office = await MOffice.findOne({
        where: {
          //Check if something changes
          [Op.or]: [{ SID: sid, status: true }, { code: sid, status: true }],
        },
      });
    }
    if (office != null) {
      responses.makeResponsesOkData(res, office, "Success");
    } else {
      responses.makeResponsesError(res, "OfficeNotFound");
    }
  } catch (e) {
    responses.makeResponsesException(res, e);
  }
}

// async function getOfficeByID (req, res) {
//   try {
//     const sid = req.params.id
//     const office = await MOffice.findOne({
//       where:
//         {
//           [Op.or]: [
//             { SID: sid, status: true  },
//             { code: sid},
//           ],

//         }
//     })
//     if(office != null)
//       responses.makeResponsesOkData(res,office, "Success")
//     else
//       responses.makeResponsesError(res, "OfficeNotFound")
//   } catch (e) {
//     responses.makeResponsesException(res, e)
//   }
// }

//Create Office
async function createOffice(req, res) {
  try {
    const officeData = req.body;
    const existoffic = await MOffice.findOne({
      where: {
        code: officeData.code,
        status: true,
      },
    });
    if (existoffic) {
      responses.makeResponsesError(res, "ExistOffice");
    } else {
      const FOffice = await MOffice.findOne({
        where: {
          code: officeData.code,
          status: false,
        },
      });
      if (FOffice) {
        await MOffice.update(
          {
            code: officeData.code,
            name: officeData.name,
            status: true,
          },
          {
            where: { SID: FOffice.SID },
          }
        );
      } else {
        await MOffice.create({
          code: officeData.code,
          name: officeData.name,
          status: true,
        });
      }
      responses.makeResponsesOk(res, "OfficeCreated");
    }
  } catch (e) {
    responses.makeResponsesException(res, e);
  }
}

//update office
async function updateOffice(req, res) {
  try {
    const id = req.params.id;
    let officeData = req.body;
    const office = await MOffice.findOne({
      where: { SID: id },
    });
    if (office != null) {
      await MOffice.update(
        {
          code: officeData.code,
          name: officeData.name,
          status: true,
        },
        {
          where: { SID: id },
        }
      );
      responses.makeResponsesOk(res, "OfficeUpdated");
    } else {
      responses.makeResponsesError(res, "OfficeNotFound");
    }
  } catch (e) {
    responses.makeResponsesException(res, e);
  }
}

//physical delete office
async function deleteOffice(req, res) {
  try {
    const id = req.params.id;
    const office = await MOffice.findOne({
      where: { SID: id },
    });
    if (office != null) {
      await MOffice.destroy({
        where: { SID: id },
      });
      responses.makeResponsesOk(res, "OfficeDeleted");
    } else {
      responses.makeResponsesError(res, "OfficeNotFound");
    }
  } catch (e) {
    responses.makeResponsesException(res, e);
  }
}

//logical delete office
async function logicaldeloffice(req, res) {
  try {
    const id = req.params.id;
    let officeData = req.body;
    const office = await MOffice.findOne({
      where: { SID: id, status: true },
    });
    if (office != null && office.status === true) {
      await MOffice.update(
        {
          code: officeData.code,
          name: officeData.name,
          status: (officeData.status = false),
        },
        {
          where: { SID: id, status: true },
        }
      );
      responses.makeResponsesOk(res, "OfficeDeleted");
    } else {
      responses.makeResponsesError(res, "OfficeNotFound");
    }
  } catch (e) {
    responses.makeResponsesException(res, e);
  }
}

module.exports = {
  getAllOffices,
  getOfficeByID,
  createOffice,
  updateOffice,
  deleteOffice,
  logicaldeloffice,
};
