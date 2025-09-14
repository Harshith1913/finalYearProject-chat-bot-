// Time slots configuration with accessibility labels
const TIME_SLOTS = {
    morning: {
        slots: ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30'],
        label: 'Morning Hours (9 AM - 12 PM)'
    },
    afternoon: {
        slots: ['14:00', '14:30', '15:00', '15:30', '16:00', '16:30'],
        label: 'Afternoon Hours (2 PM - 5 PM)'
    },
    evening: {
        slots: ['17:00', '17:30', '18:00', '18:30'],
        label: 'Evening Hours (5 PM - 7 PM)'
    }
};

// Enhanced departments with more metadata
const departments = [
    {
        id: 'cardiology',
        name: 'Cardiology',
        icon: 'fa-heart-pulse',
        description: 'Heart and cardiovascular care',
        longDescription: 'Comprehensive cardiac care including diagnostics, treatment, and prevention of heart diseases.',
        services: [
            'Cardiac Consultation',
            'ECG/EKG',
            'Stress Testing',
            'Cardiac Surgery',
            'Preventive Cardiology',
            'Heart Rhythm Management'
        ],
        emergencyAvailable: true,
        waitTime: '2-3 days',
        insuranceAccepted: true
    },
    {
        id: 'neurology',
        name: 'Neurology',
        icon: 'fa-brain',
        description: 'Brain and nervous system care',
        longDescription: 'Comprehensive neurological care including diagnostics, treatment, and prevention of neurological diseases.',
        services: [
            'Neurological Consultation',
            'EEG Testing',
            'Stroke Treatment',
            'Spine Surgery',
            'Neurorehabilitation',
            'Neurodegenerative Disease Management'
        ],
        emergencyAvailable: true,
        waitTime: '3-4 days',
        insuranceAccepted: true
    },
    {
        id: 'orthopedics',
        name: 'Orthopedics',
        icon: 'fa-bone',
        description: 'Bone and joint care',
        longDescription: 'Comprehensive orthopedic care including joint replacement, sports medicine, fracture care, and physical therapy.',
        services: [
            'Joint Replacement',
            'Sports Medicine',
            'Fracture Care',
            'Physical Therapy',
            'Orthopedic Trauma Management',
            'Orthopedic Reconstruction'
        ],
        emergencyAvailable: true,
        waitTime: '2-3 days',
        insuranceAccepted: true
    },
    {
        id: 'pediatrics',
        name: 'Pediatrics',
        icon: 'fa-child',
        description: 'Child healthcare services',
        longDescription: 'Comprehensive pediatric care including well-child visits, vaccinations, pediatric emergency, and developmental assessment.',
        services: [
            'Well-Child Visits',
            'Vaccinations',
            'Pediatric Emergency',
            'Development Assessment',
            'Pediatric Infectious Disease Management',
            'Pediatric Endocrinology'
        ],
        emergencyAvailable: true,
        waitTime: '2-3 days',
        insuranceAccepted: true
    },
    {
        id: 'oncology',
        name: 'Oncology',
        icon: 'fa-radiation',
        description: 'Cancer treatment and care',
        longDescription: 'Comprehensive oncology care including cancer screening, chemotherapy, radiation therapy, and surgical oncology.',
        services: [
            'Cancer Screening',
            'Chemotherapy',
            'Radiation Therapy',
            'Surgical Oncology',
            'Hematology',
            'Oncology Nursing'
        ],
        emergencyAvailable: true,
        waitTime: '3-4 days',
        insuranceAccepted: true
    }
];

// Enhanced doctor data structure
const doctors = [
    {
        id: 'dr-sarah-johnson',
        name: 'Dr. Sarah Johnson',
        department: 'cardiology',
        title: 'Senior Cardiologist',
        image: 'images/founder-dr-sarah-johnson-1.jpg',
        credentials: 'MD, FACC',
        experience: '15+ Years',
        languages: ['English', 'Spanish'],
        specializations: [
            'Interventional Cardiology',
            'Heart Failure Management',
            'Preventive Cardiology'
        ],
        education: [
            {
                degree: 'MD',
                institution: 'Harvard Medical School',
                year: '2005'
            },
            {
                degree: 'Cardiology Fellowship',
                institution: 'Mayo Clinic',
                year: '2008'
            }
        ],
        availability: {
            monday: {
                slots: [...TIME_SLOTS.morning.slots, ...TIME_SLOTS.afternoon.slots],
                breakTime: '13:00-14:00'
            },
            tuesday: {
                slots: [...TIME_SLOTS.morning.slots, ...TIME_SLOTS.afternoon.slots],
                breakTime: '13:00-14:00'
            },
            wednesday: {
                slots: [...TIME_SLOTS.morning.slots, ...TIME_SLOTS.evening.slots],
                breakTime: '13:00-14:00'
            },
            thursday: {
                slots: [...TIME_SLOTS.morning.slots, ...TIME_SLOTS.afternoon.slots],
                breakTime: '13:00-14:00'
            },
            friday: {
                slots: [...TIME_SLOTS.morning.slots, ...TIME_SLOTS.afternoon.slots],
                breakTime: '13:00-14:00'
            }
        },
        unavailableDates: [],
        consultationFee: 150,
        acceptsInsurance: true,
        insuranceNetworks: ['Aetna', 'Blue Cross', 'Cigna'],
        ratings: {
            overall: 4.8,
            totalReviews: 150,
            categories: {
                expertise: 4.9,
                communication: 4.7,
                punctuality: 4.8
            }
        }
    },
    {
        id: 'dr-michael-chen',
        name: 'Dr. Michael Chen',
        department: 'cardiology',
        title: 'Interventional Cardiologist',
        image: 'images/michael-chen.jpg',
        credentials: 'MD, FACC',
        experience: '12+ Years',
        languages: ['English'],
        specializations: [
            'Interventional Cardiology',
            'Heart Failure Management',
            'Preventive Cardiology'
        ],
        education: [
            {
                degree: 'MD',
                institution: 'Johns Hopkins University',
                year: '2009'
            },
            {
                degree: 'Cardiology Fellowship',
                institution: 'Mayo Clinic',
                year: '2012'
            }
        ],
        availability: {
            monday: {
                slots: [...TIME_SLOTS.morning.slots, ...TIME_SLOTS.evening.slots],
                breakTime: '13:00-14:00'
            },
            wednesday: {
                slots: [...TIME_SLOTS.morning.slots, ...TIME_SLOTS.afternoon.slots],
                breakTime: '13:00-14:00'
            },
            friday: {
                slots: [...TIME_SLOTS.morning.slots, ...TIME_SLOTS.afternoon.slots],
                breakTime: '13:00-14:00'
            }
        },
        unavailableDates: [],
        consultationFee: 120,
        acceptsInsurance: true,
        insuranceNetworks: ['Aetna', 'Blue Cross', 'Cigna'],
        ratings: {
            overall: 4.7,
            totalReviews: 100,
            categories: {
                expertise: 4.8,
                communication: 4.6,
                punctuality: 4.7
            }
        }
    },
    {
        id: 'dr-emily-parker',
        name: 'Dr. Emily Parker',
        department: 'neurology',
        title: 'Senior Neurologist',
        image: 'images/emily-parker.jpg',
        credentials: 'MD, PhD',
        experience: '18+ Years',
        languages: ['English', 'French'],
        specializations: [
            'Neurological Consultation',
            'EEG Testing',
            'Stroke Treatment',
            'Spine Surgery',
            'Neurorehabilitation',
            'Neurodegenerative Disease Management'
        ],
        education: [
            {
                degree: 'MD',
                institution: 'University of California, San Francisco',
                year: '2003'
            },
            {
                degree: 'Neurology Fellowship',
                institution: 'Johns Hopkins Hospital',
                year: '2007'
            }
        ],
        availability: {
            monday: {
                slots: [...TIME_SLOTS.morning.slots, ...TIME_SLOTS.afternoon.slots],
                breakTime: '13:00-14:00'
            },
            thursday: {
                slots: [...TIME_SLOTS.morning.slots, ...TIME_SLOTS.evening.slots],
                breakTime: '13:00-14:00'
            },
            friday: {
                slots: [...TIME_SLOTS.morning.slots, ...TIME_SLOTS.afternoon.slots],
                breakTime: '13:00-14:00'
            }
        },
        unavailableDates: [],
        consultationFee: 180,
        acceptsInsurance: true,
        insuranceNetworks: ['Aetna', 'Blue Cross', 'Cigna'],
        ratings: {
            overall: 4.8,
            totalReviews: 150,
            categories: {
                expertise: 4.9,
                communication: 4.7,
                punctuality: 4.8
            }
        }
    },
    {
        id: 'dr-james-anderson',
        name: 'Dr. James Anderson',
        department: 'orthopedics',
        title: 'Senior Orthopedic Surgeon',
        image: 'images/james-anderson.jpg',
        credentials: 'MD, FAAOS',
        experience: '20+ Years',
        languages: ['English'],
        specializations: [
            'Joint Replacement',
            'Sports Medicine',
            'Fracture Care',
            'Physical Therapy',
            'Orthopedic Trauma Management',
            'Orthopedic Reconstruction'
        ],
        education: [
            {
                degree: 'MD',
                institution: 'Yale University',
                year: '2003'
            },
            {
                degree: 'Orthopedic Surgery Fellowship',
                institution: 'Mayo Clinic',
                year: '2007'
            }
        ],
        availability: {
            monday: {
                slots: [...TIME_SLOTS.morning.slots, ...TIME_SLOTS.afternoon.slots],
                breakTime: '13:00-14:00'
            },
            wednesday: {
                slots: [...TIME_SLOTS.morning.slots, ...TIME_SLOTS.evening.slots],
                breakTime: '13:00-14:00'
            },
            thursday: {
                slots: [...TIME_SLOTS.morning.slots, ...TIME_SLOTS.afternoon.slots],
                breakTime: '13:00-14:00'
            }
        },
        consultationFee: 200,
        acceptsInsurance: true,
        insuranceNetworks: ['Aetna', 'Blue Cross', 'Cigna'],
        ratings: {
            overall: 4.9,
            totalReviews: 280,
            categories: {
                expertise: 5.0,
                communication: 4.8,
                punctuality: 4.9
            }
        }
    },
    {
        id: 'dr-lisa-martinez',
        name: 'Dr. Lisa Martinez',
        department: 'pediatrics',
        title: 'Senior Pediatrician',
        image: 'images/lisa-martinez.jpg',
        credentials: 'MD, FAAP',
        experience: '14+ Years',
        languages: ['English', 'Spanish'],
        specializations: [
            'Well-Child Visits',
            'Vaccinations',
            'Pediatric Emergency',
            'Development Assessment',
            'Pediatric Infectious Disease Management',
            'Pediatric Endocrinology'
        ],
        education: [
            {
                degree: 'MD',
                institution: 'University of California, San Francisco',
                year: '2009'
            },
            {
                degree: 'Pediatrics Fellowship',
                institution: 'Children\'s Hospital of Philadelphia',
                year: '2013'
            }
        ],
        availability: {
            tuesday: {
                slots: [...TIME_SLOTS.morning.slots, ...TIME_SLOTS.afternoon.slots],
                breakTime: '13:00-14:00'
            },
            thursday: {
                slots: [...TIME_SLOTS.morning.slots, ...TIME_SLOTS.evening.slots],
                breakTime: '13:00-14:00'
            },
            friday: {
                slots: [...TIME_SLOTS.morning.slots, ...TIME_SLOTS.afternoon.slots],
                breakTime: '13:00-14:00'
            }
        },
        consultationFee: 150,
        acceptsInsurance: true,
        insuranceNetworks: ['Aetna', 'Blue Cross', 'Cigna'],
        ratings: {
            overall: 4.8,
            totalReviews: 200,
            categories: {
                expertise: 4.9,
                communication: 4.8,
                punctuality: 4.7
            }
        }
    },
    {
        id: 'dr-rachel-kim',
        name: 'Dr. Rachel Kim',
        department: 'oncology',
        title: 'Medical Oncologist',
        image: 'images/rachel-kim.jpg',
        credentials: 'MD, PhD',
        experience: '16+ Years',
        languages: ['English', 'Korean'],
        specializations: [
            'Cancer Screening',
            'Chemotherapy',
            'Radiation Therapy',
            'Surgical Oncology',
            'Hematology',
            'Oncology Nursing'
        ],
        education: [
            {
                degree: 'MD',
                institution: 'Stanford University',
                year: '2007'
            },
            {
                degree: 'Oncology Fellowship',
                institution: 'MD Anderson Cancer Center',
                year: '2011'
            }
        ],
        availability: {
            monday: {
                slots: [...TIME_SLOTS.morning.slots, ...TIME_SLOTS.afternoon.slots],
                breakTime: '13:00-14:00'
            },
            wednesday: {
                slots: [...TIME_SLOTS.morning.slots, ...TIME_SLOTS.evening.slots],
                breakTime: '13:00-14:00'
            },
            friday: {
                slots: [...TIME_SLOTS.morning.slots, ...TIME_SLOTS.afternoon.slots],
                breakTime: '13:00-14:00'
            }
        },
        consultationFee: 200,
        acceptsInsurance: true,
        insuranceNetworks: ['Aetna', 'Blue Cross', 'Cigna'],
        ratings: {
            overall: 4.9,
            totalReviews: 220,
            categories: {
                expertise: 5.0,
                communication: 4.8,
                punctuality: 4.9
            }
        }
    },
    {
        id: 'dr-david-thompson',
        name: 'Dr. David Thompson',
        department: 'oncology',
        title: 'Radiation Oncologist',
        image: 'images/david-thompson.jpg',
        credentials: 'MD, FASTRO',
        experience: '13+ Years',
        languages: ['English'],
        specializations: [
            'Cancer Screening',
            'Chemotherapy',
            'Radiation Therapy',
            'Surgical Oncology',
            'Hematology',
            'Oncology Nursing'
        ],
        education: [
            {
                degree: 'MD',
                institution: 'University of Pennsylvania',
                year: '2010'
            },
            {
                degree: 'Radiation Oncology Fellowship',
                institution: 'Memorial Sloan Kettering',
                year: '2014'
            }
        ],
        availability: {
            tuesday: {
                slots: [...TIME_SLOTS.morning.slots, ...TIME_SLOTS.afternoon.slots],
                breakTime: '13:00-14:00'
            },
            thursday: {
                slots: [...TIME_SLOTS.morning.slots, ...TIME_SLOTS.evening.slots],
                breakTime: '13:00-14:00'
            },
            friday: {
                slots: [...TIME_SLOTS.morning.slots, ...TIME_SLOTS.afternoon.slots],
                breakTime: '13:00-14:00'
            }
        },
        consultationFee: 180,
        acceptsInsurance: true,
        insuranceNetworks: ['Aetna', 'Blue Cross', 'Cigna'],
        ratings: {
            overall: 4.8,
            totalReviews: 180,
            categories: {
                expertise: 4.9,
                communication: 4.7,
                punctuality: 4.8
            }
        }
    }
];

// Add validation schemas
const validationSchemas = {
    appointment: {
        department: {
            required: true,
            message: 'Please select a department'
        },
        doctor: {
            required: true,
            message: 'Please select a doctor'
        },
        appointmentDate: {
            required: true,
            message: 'Please select a date',
            validate: date => new Date(date) > new Date()
        },
        appointmentTime: {
            required: true,
            message: 'Please select a time'
        },
        patientName: {
            required: true,
            minLength: 2,
            message: 'Please enter your full name'
        },
        patientEmail: {
            required: true,
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Please enter a valid email address'
        },
        patientPhone: {
            required: true,
            pattern: /^\+?[\d\s-]{10,}$/,
            message: 'Please enter a valid phone number'
        }
    }
}; 