// utils/vaccineData.js
export const vaccineData = [
  {
    birthId: "2024000001",
    vaccines: [
      {
        vaccine_name: "BCG (Tuberculosis)",
        date_taken: "2024-02-10",
        next_dose_date: null
      },
      {
        vaccine_name: "OPV-0 (Polio 0 dose)",
        date_taken: "2024-02-10",
        next_dose_date: "2024-03-10"
      },
      {
        vaccine_name: "Hepatitis B Birth Dose",
        date_taken: "2024-02-10",
        next_dose_date: "2024-03-10"
      }
    ]
  },
  {
    birthId: "2024000002",
    vaccines: [
      {
        vaccine_name: "Pentavalent-1 (DPT, HepB, Hib)",
        date_taken: "2024-03-15",
        next_dose_date: "2024-04-15"
      },
      {
        vaccine_name: "OPV-1 (Polio 1st Dose)",
        date_taken: "2024-03-15",
        next_dose_date: "2024-04-15"
      },
      {
        vaccine_name: "PCV-1 (Pneumococcal Vaccine)",
        date_taken: "2024-03-15",
        next_dose_date: "2024-04-15"
      }
    ]
  },
  {
    birthId: "2024000003",
    vaccines: [
      {
        vaccine_name: "Measles-Rubella (MR-1)",
        date_taken: "2024-08-10",
        next_dose_date: "2025-02-10"
      }
    ]
  },
  {
    birthId: "2024000004",
    vaccines: [] // newborn, no vaccine yet
  },
  {
    birthId: "2024000005",
    vaccines: [
      {
        vaccine_name: "BCG",
        date_taken: "2024-04-01",
        next_dose_date: null
      },
      {
        vaccine_name: "OPV-0",
        date_taken: "2024-04-01",
        next_dose_date: "2024-05-01"
      }
    ]
  }
];
