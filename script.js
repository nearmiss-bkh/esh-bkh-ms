// =====================================================
// NEAR MISS REPORTING SYSTEM
// EMPLOYEE SUBMISSION
// MULTIPLE PHOTO VERSION
// =====================================================


// =====================================================
// FORM ELEMENTS
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

// Maximum size for EACH original photo
const MAX_PHOTO_SIZE =
    10 * 1024 * 1024; // 10 MB


// Maximum number of photos
const MAX_PHOTOS =
    10;


// Resize settings
const MAX_WIDTH =
    1200;

const MAX_HEIGHT =
    1200;


// JPEG compression quality
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


                            // ---------------------------------
                            // RESIZE IF NECESSARY
                            // ---------------------------------

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


                            // ---------------------------------
                            // CREATE CANVAS
                            // ---------------------------------

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


                            // ---------------------------------
                            // CONVERT TO JPEG
                            // ---------------------------------

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
                                    "_" +
                                    Math.random()
                                        .toString(36)
                                        .substring(2, 8) +
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


        // =================================================
        // MULTIPLE PHOTO PROCESSING
        // =================================================

        let photos = [];


        // -------------------------------------------------
        // CHECK PHOTOS
        // -------------------------------------------------

        if (
            photoInput.files &&
            photoInput.files.length > 0
        ) {


            // ---------------------------------------------
            // CHECK MAXIMUM NUMBER OF PHOTOS
            // ---------------------------------------------

            if (
                photoInput.files.length >
                MAX_PHOTOS
            ) {

                successMessage.innerHTML = `
                    <strong>
                        ❌ Too many photos.
                    </strong>

                    <br><br>

                    You can upload a maximum of
                    <strong>${MAX_PHOTOS} photos</strong>.
                `;

                return;
            }


            // ---------------------------------------------
            // PROCESS EACH PHOTO
            // ---------------------------------------------

            for (
                let i = 0;
                i < photoInput.files.length;
                i++
            ) {

                const photo =
                    photoInput.files[i];


                // -----------------------------------------
                // CHECK FILE SIZE
                // -----------------------------------------

                if (
                    photo.size >
                    MAX_PHOTO_SIZE
                ) {

                    successMessage.innerHTML = `
                        <strong>
                            ❌ Photo ${i + 1} is too large.
                        </strong>

                        <br><br>

                        Maximum photo size is
                        <strong>10 MB per photo</strong>.

                        <br><br>

                        File:
                        <strong>
                            ${photo.name}
                        </strong>
                    `;

                    return;
                }


                // -----------------------------------------
                // SHOW PROCESSING MESSAGE
                // -----------------------------------------

                successMessage.innerHTML = `
                    <strong>
                        📷 Processing photo ${i + 1}
                        of ${photoInput.files.length}...
                    </strong>
                `;


                try {

                    const compressed =
                        await compressPhoto(
                            photo
                        );


                    photos.push({

                        photoData:
                            compressed.data,

                        photoName:
                            compressed.name,

                        photoType:
                            compressed.type

                    });


                } catch (error) {

                    successMessage.innerHTML = `
                        <strong>
                            ❌ Photo ${i + 1}
                            processing failed.
                        </strong>

                        <br><br>

                        ${error.message}
                    `;

                    return;
                }

            }

        }


        // =================================================
        // CREATE REPORT
        // =================================================

        const report = {

            // ---------------------------------------------
            // REPORT INFORMATION
            // ---------------------------------------------

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


            // ---------------------------------------------
            // MULTIPLE PHOTOS
            // ---------------------------------------------

            photos:
                photos,


            // ---------------------------------------------
            // STATUS
            // ---------------------------------------------

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

            <br><br>

            ${photos.length}
            photo${photos.length === 1 ? "" : "s"}
            attached.
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


            // -------------------------------------------------
            // READ RESPONSE
            // -------------------------------------------------

            const result =
                await response.json();


            console.log(
                "Google Apps Script response:",
                result
            );


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

                <br><br>

                📷 Photos uploaded:
                <strong>
                    ${photos.length}
                </strong>
            `;


            // -------------------------------------------------
            // RESET FORM
            // -------------------------------------------------

            form.reset();


            // -------------------------------------------------
            // PUT DATE/TIME BACK
            // -------------------------------------------------

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
