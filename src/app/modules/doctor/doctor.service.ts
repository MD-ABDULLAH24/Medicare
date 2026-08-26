import { prisma } from "../../lib/prisma";

const getAllDoctor = async () => {
  const doctors = await prisma.doctor.findMany({
    include: {
      user: true,
      specialty: {
        include: {
          specialty: true,
        },
      },
    },
  });
  return doctors;
};

// const getDoctorById = async (id: string) => {
//   const doctor = await prisma.doctor.findUnique({
//     where: {
//       id,
//       isDeleted: false,
//     },
//     include: {
//       user: true,
//       specialty: {
//         include: {
//           specialty: true,
//         },
//       },
      
//     },
//   });
// };

export const doctorService = {
  getAllDoctor,
};
