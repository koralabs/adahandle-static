import React from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useCardanoscanDomain } from "../../../lib/helpers/env";

export enum SessionStatusType {
  WAITING_FOR_PAYMENT = "WAITING_FOR_PAYMENT",
  WAITING_FOR_MINING = "WAITING_FOR_MINING",
  WAITING_FOR_CONFIRMATION = "WAITING_FOR_CONFIRMATION",
  CONFIRMED = "CONFIRMED",
  REFUNDED = "REFUNDED",
}

export interface SessionStatus {
  mintingPosition?: {
    position: number;
    minutes: number;
  };
  handle: string;
  txId?: string;
  type: SessionStatusType;
}

interface Props {
  type: SessionStatusType;
  items: SessionStatus[];
}

export const TypeAccordion: React.FC<Props> = ({ items, type }) => {
  const cardanoscanDomain = useCardanoscanDomain();

  const typeText = type.replace(/_/g, " ");

  const renderRightText = (session: SessionStatus) => {
    if (
      type === SessionStatusType.CONFIRMED ||
      type === SessionStatusType.WAITING_FOR_CONFIRMATION
    ) {
      return (
        <a
          className="text-primary-100"
          href={`https://${cardanoscanDomain}/transaction/${session.txId}`}
          target="_blank"
          rel="noopener nofollow"
        >
          {session.txId}
        </a>
      );
    }

    if (type === SessionStatusType.WAITING_FOR_MINING) {
      return (
        <>
          Current position in Queue: {session.mintingPosition?.position}{" "}
          expected wait time: {session.mintingPosition?.minutes} minutes
        </>
      );
    }

    return null;
  };

  return (
    <Accordion style={{ backgroundColor: "#1C2541" }} className="bg-dark-200">
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <span className="text-white font-bold">
          {typeText} ({items?.length})
        </span>
      </AccordionSummary>
      <AccordionDetails>
        <List>
          {items.map((s) => (
            <ListItem>
              <ListItemText className="text-white" primary={s.handle} />
              {renderRightText(s)}
            </ListItem>
          ))}
        </List>
      </AccordionDetails>
    </Accordion>
  );
};