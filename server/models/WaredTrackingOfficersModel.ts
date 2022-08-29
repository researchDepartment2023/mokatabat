import seqeulize from "../db/seqeulize";
import { DataTypes } from "sequelize";
import emitSocketEvent from "../helpers/socketIo";

const WaredTrackingOfficers = seqeulize.define(
  "waredtrackingofficers",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    wared_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    officer_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    opened: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: true,
    },
    openedDate: {
      type: DataTypes.DATE,
      defaultValue: null,
      allowNull: true,
    },
  },
  {
    // to make the tabel name equal the model name
    freezeTableName: true,
    timestamps: false,
  }
); 
WaredTrackingOfficers.afterCreate(() => {
  emitSocketEvent("refetchWaredAndSaderUnreadNumbers");
});
WaredTrackingOfficers.afterUpdate(() => {
  emitSocketEvent("refetchWaredAndSaderUnreadNumbers");
});

WaredTrackingOfficers.afterDestroy(() => {
  emitSocketEvent("refetchWaredAndSaderUnreadNumbers");
});

export default WaredTrackingOfficers;
