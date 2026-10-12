import API from "./api"

export const getLastResult = async(userId)=>{
    const res = await API.get("/blue_36_last_result", {
        params :{
            user_id : userId
        }
    })

    return res.data
}

export const getBlue36BetHistory = async(userId, limit = 5)=>{
    const res = await API.get("/blue_36_bet_history", {
        params: {
            limit,
            user_id: userId,
        }
    })

    return res.data
}

export const placeBlue36Bet = async (payload) => {
    const res = await API.post("/blue_36_bet", payload)
    return res.data
}

export const getBlue36WinAmount = async (userId) => {
    try {
        const res = await API.get("/blue_36_win_amount", {
            params: {
                user_id: userId,
            },
        })
        return res.data
    } catch (e) {
        const res = await API.get(`/blue_36_win_amount/${userId}`)
        return res.data
    }
}

