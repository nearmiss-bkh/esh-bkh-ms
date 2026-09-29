// =====================================================
// NEAR MISS REPORTING SYSTEM
// EMPLOYEE SUBMISSION
// MULTIPLE PHOTO VERSION
// =====================================================

const form = document.getElementById("nearMissForm");
const successMessage = document.getElementById("successMessage");
const dateTime = document.getElementById("dateTime");
const photoInput = document.getElementById("photo");

const GOOGLE_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbyvYdD4VfoUM-vD5yS2AdJ_vCSNOU3TE6qY1J9ZIqFHqndGF-a_LXbX0GDmmU3A5VRrIw/exec";

const MAX_PHOTOS = 10;
const MAX_PHOTO_SIZE = 10 * 1024 * 1024;

const MAX_WIDTH = 1200;
const MAX_HEIGHT = 1200;
const JPEG_QUALITY = 0.75;


// =====================================================
// DATE & TIME
// =====================================================

function setDateTime() {

    const now = new Date();

    now.setMinutes(
        now.getMinutes() - now.getTimezoneOffset()
    );

    dateTime.value =
        now.toISOString().slice(0, 16);
}

setDateTime();


// =====================================================
// REPORT NUMBER
// =====================================================

function generateReportNumber() {

    const now = new Date();

    const year = now.getFullYear();

    const month =
        String(now.getMonth() + 1).padStart(2, "0");

    const day =
        String(now.getDate()).padStart(2, "0");

    let counter =
        Number(
            localStorage.getItem("nearMissCounter")
        ) || 0;

    counter++;

    localStorage.setItem(
        "nearMissCounter",
        counter
    );

    return (
        `NM-${year}${month}${day}-` +
        `${String(counter).padStart(4, "0")}`
    );
}


// =====================================================
// COMPRESS PHOTO
// =====================================================

function compressPhoto(file) {

    return new Promise((resolve, reject) => {

        const reader = new FileReader();

        reader.onload = function(event) {

            const img = new Image();

            img.onload = function() {

                let width = img.width;
                let height = img.height;

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
                        Math.round(width * ratio);

                    height =
                        Math.round(height * ratio);
                }


                const canvas =
                    document.createElement("canvas");

                canvas.width = width;
                canvas.height = height;


                const context =
                    canvas.getContext("2d");

                context.drawImage(
                    img,
                    0,
                    0,
                    width,
                    height
                );


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


            img.onerror = function() {

                reject(
                    new Error(
                        "Unable to read image."
                    )
                );

            };


            img.src = event.target.result;

        };


        reader.onerror = function() {

            reject(
                new Error(
                    "Unable to read photo."
                )
            );

        };


        reader.readAsDataURL(file);

    });

}


// =====================================================
// SUBMIT FORM
// =====================================================

form.addEventListener(
    "submit",
    async function(event) {

        // IMPORTANT
        event.preventDefault();

        // Prevent double submission
        const submitButton =
            form.querySelector(
                ".submit-button"
            );

        submitButton.disabled = true;

        submitButton.textContent =
            "SUBMITTING...";


        successMessage.style.display =
            "block";

        successMessage.innerHTML =
            "<strong>⏳ Preparing report...</strong>";


        try {

            // ==========================================
            // GENERATE REPORT NUMBER
            // ==========================================

            const reportNumber =
                generateReportNumber();


            // ==========================================
            // GET PHOTOS
            // ==========================================

            let photos = [];

            const selectedFiles =
                photoInput.files;


            if (
                selectedFiles &&
                selectedFiles.length > 0
            ) {

                if (
                    selectedFiles.length >
                    MAX_PHOTOS
                ) {

                    throw new Error(
                        "You can upload a maximum of " +
                        MAX_PHOTOS +
                        " photos."
                    );
                }


                // ======================================
                // PROCESS EACH PHOTO
                // ======================================

                for (
                    let i = 0;
                    i < selectedFiles.length;
                    i++
                ) {

                    const photo =
                        selectedFiles[i];


                    if (
                        photo.size >
                        MAX_PHOTO_SIZE
                    ) {

                        throw new Error(
                            "Photo " +
                            (i + 1) +
                            " is larger than 10 MB."
                        );
                    }


                    successMessage.innerHTML =
                        "<strong>📷 Processing photo " +
                        (i + 1) +
                        " of " +
                        selectedFiles.length +
                        "...</strong>";


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

                }

            }


            // ==========================================
            // CREATE REPORT
            // ==========================================

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

                photos:
                    photos,

                status:
                    "New",

                submittedAt:
                    new Date().toISOString()

            };


            // ==========================================
            // UPLOAD
            // ==========================================

            successMessage.innerHTML =
                "<strong>☁️ Uploading report...</strong><br><br>" +
                photos.length +
                " photo(s) attached.";


            const response =
                await fetch(
                    GOOGLE_SCRIPT_URL,
                    {

                        method: "POST",

                        headers: {
                            "Content-Type":
                                "text/plain;charset=utf-8"
                        },

                        body:
                            JSON.stringify(report)

                    }
                );


            const result =
                await response.json();


            console.log(
                "Google Apps Script response:",
                result
            );


            // ==========================================
            // CHECK RESULT
            // ==========================================

            if (!result.success) {

                throw new Error(
                    result.error ||
                    "Google submission failed."
                );

            }


            // ==========================================
            // SUCCESS
            // ==========================================

            successMessage.innerHTML =
                "<strong>✅ Report submitted successfully!</strong>" +
                "<br><br>" +
                "Report No: <strong>" +
                reportNumber +
                "</strong>" +
                "<br><br>" +
                "📷 Photos uploaded: <strong>" +
                photos.length +
                "</strong>";


            // ==========================================
            // ONLY RESET AFTER SUCCESS
            // ==========================================

            form.reset();

            setDateTime();


            const photoCount =
                document.getElementById(
                    "photoCount"
                );

            if (photoCount) {

                photoCount.textContent =
                    "No photos selected";

            }


        }

        catch (error) {

            console.error(
                "Submission error:",
                error
            );


            successMessage.innerHTML =
                "<strong>❌ Unable to submit report.</strong>" +
                "<br><br>" +
                error.message;


            // IMPORTANT:
            // DO NOT RESET FORM WHEN ERROR OCCURS

        }

        finally {

            submitButton.disabled =
                false;

            submitButton.textContent =
                "SUBMIT NEAR MISS";

        }

    }
);
