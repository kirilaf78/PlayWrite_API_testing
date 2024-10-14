import { test, expect, APIResponse } from "@playwright/test";
import bookingAPIRequestBody from "../test-data/post_dynamic_request_body.json";
import { stringFormat } from "../utils/common";
import tokenRequestBody from "../test-data/token_request_body.json";
import patchRequestBody from "../test-data/patch_request_body.json";

interface BookingDates {
  checkin: string;
  checkout: string;
}

interface Booking {
  firstname: string;
  lastname: string;
  totalprice: number;
  depositpaid: boolean;
  bookingdates: BookingDates;
  additionalneeds: string;
}

interface PostAPIResponseBody {
  bookingid: number;
  booking: Booking;
}

test("Create DELETE API request in Playwright", async ({ request }) => {
  const dynamicRequestBody = stringFormat(
    JSON.stringify(bookingAPIRequestBody),
    "cypress",
    "js",
    "apple"
  );
  console.log(dynamicRequestBody);

  // Create POST API request using Playwright with JSON file data
  const postAPIResponse: APIResponse = await request.post("/booking", {
    data: JSON.parse(dynamicRequestBody),
  });

  // Validate the status code
  const postAPIResponseBody: PostAPIResponseBody = await postAPIResponse.json();
  console.log("++POST Response+++++++++++");
  console.log(postAPIResponseBody);
  const bId = postAPIResponseBody.bookingid;

  // Check if the response was OK and has the correct status
  expect(postAPIResponse.ok()).toBeTruthy();
  expect(postAPIResponse.status()).toBe(200);

  // Validate API response JSON object
  expect(postAPIResponseBody.booking).toHaveProperty("firstname", "cypress");
  expect(postAPIResponseBody.booking).toHaveProperty("lastname", "js");
  expect(postAPIResponseBody.booking).toHaveProperty(
    "additionalneeds",
    "apple"
  );

  // Validate API response nested JSON object (bookingdates)
  expect(postAPIResponseBody.booking.bookingdates).toHaveProperty(
    "checkin",
    "2018-01-01"
  );
  expect(postAPIResponseBody.booking.bookingdates).toHaveProperty(
    "checkout",
    "2019-01-01"
  );

  //Get API call
  console.log("==GET Response=======================");
  const getAPIResponse = await request.get(`/booking/${bId}`);
  console.log(await getAPIResponse.json());
  //Validate status code
  expect(getAPIResponse.ok()).toBeTruthy();
  expect(getAPIResponse.status()).toBe(200);
  console.log("==token for PUT Request===================");
  // Generate token
  const tokenResponse = await request.post(`/auth`, {
    data: tokenRequestBody,
  });
  const tokenAPIResponseBody = await tokenResponse.json();

  console.log(tokenAPIResponseBody);
  const tokenNo = tokenAPIResponseBody.token;
  console.log(tokenNo);

  // PATCH API call

  const patchAPIResponse: APIResponse = await request.patch(`/booking/${bId}`, {
    headers: {
      "Content-Type": "application/json",
      Cookie: `token= ${tokenNo}`,
    },
    data: patchRequestBody,
  });
  console.log("++Patch Response+++++++++++++++++++++++++++++++++++");
  console.log(patchAPIResponse);
  console.log("++PATCH Response Json+++++++++++++++++++++++++++++++");

  const patchResponseBody = await patchAPIResponse.json();
  console.log(patchResponseBody);

  //Validate status code
  expect(patchAPIResponse.status()).toBe(200);

  // Delete API
  console.log("++Delete+++++++++++++++++++++++++++++++");

  const deleteAPIResponse: APIResponse = await request.delete(
    `/booking/${bId}`,
    {
      headers: {
        "Content-Type": "application/json",
        Cookie: `token= ${tokenNo}`,
      },
    }
  );
  // const deleteResponseBody = await deleteAPIResponse.json();
  console.log(deleteAPIResponse);

  //Validate status code
  expect(deleteAPIResponse.status()).toBe(201);
  expect(deleteAPIResponse.statusText()).toBe("Created");
});
