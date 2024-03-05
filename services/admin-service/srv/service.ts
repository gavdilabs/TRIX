import { CDSDispatcher } from "@dxfrontier/cds-ts-dispatcher";
import PingHandler from "./controller/functions/ping";

export = new CDSDispatcher([
    // Entities
    // Functions
    PingHandler
    // Actions
]).initialize();
