import USER from './user.schema'
import OTP from './otp.schema'
import CONTACT from "./contact.schema"
import GROUP from "./group.schema"
import GROUPCHAT from "./groupChat.schema"
import PROCESSCHAT from "./processChat.schema"
import PROCESSGROUP  from "./processGroup.schema"
import CHAT from "./chat.schema"
import INVITE from './invitation.schema'

const OTPSchema = { Read: OTP.OTPRead, Write: OTP.OTPWrite };
const UserSchema = { Read: USER.UserRead, Write: USER.UserWrite, };
const InvitationSchema = { Read: INVITE.InviteRead, Write: INVITE.InviteWrite, };
const ChatSchema = { Read: CHAT.ChatRead, Write: CHAT.ChatWrite, };
const ContactSchema = { Read: CONTACT.ContactRead, Write: CONTACT.ContactWrite, };
const GroupSchema = { Read: GROUP.GroupRead, Write: GROUP.GroupWrite, };
const GroupChatSchema = { Read: GROUPCHAT.GroupChatRead, Write: GROUPCHAT.GroupChatWrite, };
const ProcessChatSchema = { Read: PROCESSCHAT.ChatProcessRead, Write: PROCESSCHAT.ChatProcessWrite, };
const ProcessGroupSchema = { Read: PROCESSGROUP.GroupProcessRead, Write: PROCESSGROUP.GroupProcessWrite, };

export {
    UserSchema,
    OTPSchema,
    ContactSchema,
    GroupSchema,
    GroupChatSchema,
    ProcessChatSchema,
    ProcessGroupSchema,
    ChatSchema,
    InvitationSchema
}