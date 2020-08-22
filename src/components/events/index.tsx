import React, { useState } from "react";
import { useEventsQuery } from "../../generated/graphql";

import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

import Timeline from "../timeline";
import EventItem from "./eventItem";

const useStyles = makeStyles((theme) => ({
  heading: {
    margin: theme.spacing(4),
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "center",
    padding: theme.spacing(4),
  },
}));

const Events = () => {
  const startWith = 5;
  const eventsToFetch = 3;

  const [offset, setOffset] = useState(startWith);
  const { loading, error, data, fetchMore } = useEventsQuery({
    variables: {
      order: "desc",
      sort: "event_date_utc",
      limit: startWith,
      offset: 0,
    },
  });
  const { heading, buttonContainer } = useStyles();

  if (error) return <p>error</p>;

  function loadMoreHandler() {
    fetchMore({
      variables: {
        order: "desc",
        sort: "event_date_utc",
        limit: eventsToFetch,
        offset: offset,
      },
    });

    setOffset(offset + eventsToFetch);
  }
  return (
    <div>
      <Typography
        className={heading}
        component="h3"
        variant="h3"
        align="center"
      >
        Events
      </Typography>
      {loading ? (
        <p>loading...</p>
      ) : (
        <>
          {data?.histories && (
            <Timeline
              data={data.histories?.map((event, i) => ({
                time: event?.event_date_utc ? event.event_date_utc : "",
                dotColor: "blue",
                content: (
                  <EventItem
                    title={event?.title ? event.title : "N/A"}
                    date={event?.event_date_utc ? event.event_date_utc : "N/A"}
                    details={event?.details ? event.details : "N/A"}
                    videolink={
                      event?.flight?.links?.video_link
                        ? event.flight.links.video_link
                        : null
                    }
                  />
                ),
              }))}
            />
          )}

          <div className={buttonContainer}>
            <Button
              color="secondary"
              variant="contained"
              onClick={loadMoreHandler}
            >
              Load more
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default Events;