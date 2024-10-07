import { test, expect, APIResponse } from '@playwright/test';
import postRequest from '../test-data/post_request_body.json';

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
  booking: Booking;
}

test("Create POST API request using JSON file in Playwright", async ({ request }) => {
  // Create POST API request using Playwright with JSON file data
  const postAPIResponse: APIResponse = await request.post('/booking', {
    data: postRequest,
  });

  // Validate the status code
  const postAPIResponseBody: PostAPIResponseBody = await postAPIResponse.json();

  console.log(postAPIResponseBody);

  // Check if the response was OK and has the correct status
  expect(postAPIResponse.ok()).toBeTruthy();
  expect(postAPIResponse.status()).toBe(200);

  // Validate API response JSON object
  expect(postAPIResponseBody.booking).toHaveProperty(
    'firstname',
    'testers talk playwright'
  );
  expect(postAPIResponseBody.booking).toHaveProperty(
    'lastname',
    'testers talk api testing'
  );

  // Validate API response nested JSON object (bookingdates)
  expect(postAPIResponseBody.booking.bookingdates).toHaveProperty(
    'checkin',
    '2018-01-01'
  );
  expect(postAPIResponseBody.booking.bookingdates).toHaveProperty(
    'checkout',
    '2019-01-01'
  );
});
