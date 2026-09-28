// =====================================================
// NEAR MISS REPORTING SYSTEM
// EMPLOYEE SUBMISSION
// =====================================================

const form =
    document.getElementById("nearMissForm");

const successMessage =
    document.getElementById("successMessage");

const dateTime =
    document.getElementById("dateTime");

const photoInput =
    document.getElementById("photo");


// =====================================================
// GOOGLE APPS SCRIPT WEB APP URL
// =====================================================

const GOOGLE_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbyvYdD4VfoUM-vD5yS2AdJ_vCSNOU3TE6qY1J9ZIqFHqndGF-a_LXbX0GDmmU3A5VRrIw/exec";


// =====================================================
// PHOTO SETTINGS
// =====================================================

const MAX_PHOTO_SIZE =
    10 * 1024 * 1024; // 10 MB

const MAX_WIDTH =
    1200;

const MAX_HEIGHT =
    1200;

const JPEG_QUALITY =
    0.75;


// =====================================================
// SET CURRENT DATE & TIME
// =====================================================

function setDateTime() {

    const now =
        new Date();

    now.setMinutes(
        now.getMinutes() -
        now.getTimezoneOffset()
    );

    dateTime.value =
        now.toISOString().slice(0, 16);
}


// Run when page opens
setDateTime();


// =====================================================
// GENERATE REPORT NUMBER
// =====================================================

function generateReportNumber() {

    const now =
        new Date();

    const year =
        now.getFullYear();

    const month =
        String(
            now.getMonth() + 1
        ).padStart(2, "0");

    const day =
        String(
            now.getDate()
        ).padStart(2, "0");


    let counter =
        Number(
            localStorage.getItem(
                "nearMissCounter"
            )
        ) || 0;


    counter++;


    localStorage.setItem(
        "nearMissCounter",
        counter
    );


    return (
        `NM-${year}${month}${day}-${String(counter).padStart(4, "0")}`
    );
}


// =====================================================
// COMPRESS PHOTO
// =====================================================

function compressPhoto(file) {

    return new Promise(
        (resolve, reject) => {

            const reader =
                new FileReader();


            reader.onload =
                function(event) {

                    const img =
                        new Image();


                    img.onload =
                        function() {

                            let width =
                                img.width;

                            let height =
                                img.height;


                            // Resize if necessary
                            if (
                                width > MAX_WIDTH ||
                                height > MAX_HEIGHT
                            ) {

                                const ratio =
                                    Math.min(
                                        MAX_WIDTH / width,
                                        MAX_HEIGHT / height
                                    );


                                width =
                                    Math.round(
                                        width * ratio
                                    );


                                height =
                                    Math.round(
                                        height * ratio
                                    );
                            }


                            // Create canvas
                            const canvas =
                                document.createElement(
                                    "canvas"
                                );


                            canvas.width =
                                width;

                            canvas.height =
                                height;


                            const context =
                                canvas.getContext(
                                    "2d"
                                );


                            context.drawImage(
                                img,
                                0,
                                0,
                                width,
                                height
                            );


                            // Convert to JPEG
                            const compressed =
                                canvas.toDataURL(
                                    "image/jpeg",
                                    JPEG_QUALITY
                                );


                            resolve({

                                data:
                                    compressed.split(",")[1],

                                type:
                                    "image/jpeg",

                                name:
                                    "NearMiss_" +
                                    Date.now() +
                                    ".jpg"

                            });

                        };


                    img.onerror =
                        function() {

                            reject(
                                new Error(
                                    "Unable to read image."
                                )
                            );

                        };


                    img.src =
                        event.target.result;

                };


            reader.onerror =
                function() {

                    reject(
                        new Error(
                            "Unable to read photo."
                        )
                    );

                };


            reader.readAsDataURL(
                file
            );

        }
    );
}


// =====================================================
// FORM SUBMISSION
// =====================================================

form.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();


        // -------------------------------------------------
        // SHOW PREPARING MESSAGE
        // -------------------------------------------------

        successMessage.innerHTML = `
            <strong>
                ⏳ Preparing report...
            </strong>
        `;


        successMessage.style.display =
            "block";


        // -------------------------------------------------
        // GENERATE REPORT NUMBER
        // -------------------------------------------------

        const reportNumber =
            generateReportNumber();


        // -------------------------------------------------
        // PHOTO VARIABLES
        // -------------------------------------------------

        let photoData =
            "";

        let photoName =
            "";

        let photoType =
            "";


        // -------------------------------------------------
        // CHECK PHOTO
        // -------------------------------------------------

        if (
            photoInput.files &&
            photoInput.files.length > 0
        ) {

            const photo =
                photoInput.files[0];


            // Check maximum size
            if (
                photo.size >
                MAX_PHOTO_SIZE
            ) {

                successMessage.innerHTML = `
                    <strong>
                        ❌ Photo is too large.
                    </strong>

                    <br><br>

                    Maximum photo size is
                    <strong>10 MB</strong>.
                `;

                return;
            }


            // Show processing message
            successMessage.innerHTML = `
                <strong>
                    📷 Processing photo...
                </strong>
            `;


            try {

                const compressed =
                    await compressPhoto(
                        photo
                    );


                photoData =
                    compressed.data;


                photoName =
                    compressed.name;


                photoType =
                    compressed.type;


            } catch (error) {

                successMessage.innerHTML = `
                    <strong>
                        ❌ Photo processing failed.
                    </strong>

                    <br><br>

                    ${error.message}
                `;

                return;
            }
        }


        // =================================================
        // CREATE REPORT
        // =================================================

        const report = {

            reportNumber:
                reportNumber,

            dateTime:
                document.getElementById(
                    "dateTime"
                ).value,

            location:
                document.getElementById(
                    "location"
                ).value,

            department:
                document.getElementById(
                    "department"
                ).value,

            hazardCategory:
                document.getElementById(
                    "hazardCategory"
                ).value,

            whatHappened:
                document.getElementById(
                    "whatHappened"
                ).value,

            reporterName:
                document.getElementById(
                    "reporterName"
                ).value,

            photoData:
                photoData,

            photoName:
                photoName,

            photoType:
                photoType,

            status:
                "New",

            submittedAt:
                new Date().toISOString()

        };


        // =================================================
        // UPLOAD
        // =================================================

        successMessage.innerHTML = `
            <strong>
                ☁️ Uploading report...
            </strong>
        `;


        try {

            const response =
                await fetch(
                    GOOGLE_SCRIPT_URL,
                    {
                        method:
                            "POST",

                        headers:
                            {
                                "Content-Type":
                                    "text/plain;charset=utf-8"
                            },

                        body:
                            JSON.stringify(
                                report
                            )
                    }
                );


            const result =
                await response.json();


            // -------------------------------------------------
            // CHECK RESULT
            // -------------------------------------------------

            if (
                !result.success
            ) {

                throw new Error(
                    result.error ||
                    "Google submission failed."
                );

            }


            // =================================================
            // SUCCESS
            // =================================================

            successMessage.innerHTML = `
                <strong>
                    ✅ Report submitted successfully!
                </strong>

                <br><br>

                Report No:
                <strong>
                    ${reportNumber}
                </strong>
            `;


            // Reset form
            form.reset();


            // Put date/time back
            setDateTime();


        } catch (error) {

            console.error(
                "Submission error:",
                error
            );


            successMessage.innerHTML = `
                <strong>
                    ❌ Unable to submit report.
                </strong>

                <br><br>

                ${error.message}
            `;

        }

    }
);